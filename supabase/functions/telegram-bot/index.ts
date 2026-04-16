// telegram-bot/index.ts
// Supabase Edge Function para recibir comandos de Telegram

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const ALLOWED_USER_IDS = ['1895932994']; // Tu Telegram ID

interface TelegramUpdate {
  update_id?: number;
  message?: {
    from?: { id?: number; username?: string; first_name?: string };
    text?: string;
    chat?: { id: number };
  };
  callback_query?: {
    from?: { id?: number };
    data?: string;
  };
}

interface CommandResult {
  summary: string;
  duration: number;
  changes: { path: string; type: 'created' | 'modified' | 'deleted' }[];
  errors: string[];
}

function getTelegramId(update: TelegramUpdate): string | null {
  const id = update.message?.from?.id || update.callback_query?.from?.id;
  return id ? id.toString() : null;
}

function isAuthorized(telegramId: string): boolean {
  return ALLOWED_USER_IDS.includes(telegramId);
}

function parseCommand(text: string): { action: string; args: string; raw: string } {
  const trimmed = text.trim();
  
  if (trimmed.startsWith('/')) {
    const [cmd, ...args] = trimmed.slice(1).split(' ');
    const action = cmd.toLowerCase() === 'start' || cmd.toLowerCase() === 'help' ? 'help' : 
                   cmd.toLowerCase() === 'status' ? 'status' : 
                   cmd.toLowerCase() === 'cancel' ? 'cancel' : 'code';
    return { action, args: args.join(' '), raw: trimmed };
  }
  
  return { action: 'code', args: trimmed, raw: trimmed };
}

async function sendMessage(chatId: string | number, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

function buildHelpMessage(): string {
  return `*Dungeon Forge Bot*\n\n` +
    `*Comandos:*\n` +
    `/start - Mostrar ayuda\n` +
    `/help - Mostrar ayuda\n` +
    `/status - Ver estado de comandos\n\n` +
    `*Sin slash:*\n` +
    `Envía cualquier texto para procesarlo\n\n` +
    `*Ejemplos:*\n` +
    `• "analiza el código"\n` +
    `• "crea un componente Button"`;
}

serve(async (req: Request) => {
  try {
    const update: TelegramUpdate = await req.json();
    
    if (!update.update_id) {
      return new Response('OK');
    }
    
    const telegramId = getTelegramId(update);
    if (!telegramId) {
      return new Response('OK');
    }
    
    const chatId = update.message?.chat?.id || telegramId;
    
    if (!isAuthorized(telegramId)) {
      await sendMessage(chatId, '⛔ *Acceso denegado*\n\nNo tienes permiso para usar este bot.');
      return new Response('Forbidden', { status: 403 });
    }
    
    const text = update.message?.text || update.callback_query?.data;
    if (!text) {
      return new Response('OK');
    }
    
    const command = parseCommand(text);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (command.action === 'help') {
      await sendMessage(chatId, buildHelpMessage());
      return new Response('OK');
    }
    
    if (command.action === 'status') {
      const { count: pending } = await supabase
        .from('telegram_commands')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', telegramId)
        .eq('status', 'pending');
      
      const { count: processing } = await supabase
        .from('telegram_commands')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', telegramId)
        .eq('status', 'processing');
      
      const msg = `📊 *Estado*\n\n⏳ Pendientes: ${pending || 0}\n🔄 Procesando: ${processing || 0}`;
      await sendMessage(chatId, msg);
      return new Response('OK');
    }
    
    const { data, error } = await supabase
      .from('telegram_commands')
      .insert({
        user_id: telegramId,
        message: command.raw,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('DB error:', error);
      await sendMessage(chatId, '❌ Error al guardar comando.');
      return new Response('Error', { status: 500 });
    }
    
    const shortId = data.id.slice(0, 8);
    await sendMessage(chatId, `📬 *Comando recibido*\n\n` +
      `\`#${shortId}\`\n` +
      `⏳ Procesando en segundo plano...`);
    
    return new Response('OK');
    
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response('Error', { status: 500 });
  }
});
