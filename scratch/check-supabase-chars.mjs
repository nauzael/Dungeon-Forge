import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function checkSupabaseNested() {
  const { data: characters, error: charError } = await supabase
    .from('characters')
    .select('id, user_id, data')
    .is('deleted_at', null);

  if (charError) {
    console.error('Error:', charError.message);
    return;
  }

  console.log(`Leídos ${characters.length} personajes.`);
  let nestedUserIdCount = 0;
  
  characters.forEach(char => {
    const charData = typeof char.data === 'string' ? JSON.parse(char.data) : char.data;
    if (charData && charData.user_id) {
      nestedUserIdCount++;
      if (nestedUserIdCount <= 5) {
        console.log(`Personaje "${charData.name}" (${char.id}):`);
        console.log(`  - Root user_id (Supabase): ${char.user_id}`);
        console.log(`  - Nested user_id (inside data): ${charData.user_id}`);
      }
    }
  });

  console.log(`Total de personajes con user_id anidado: ${nestedUserIdCount} de ${characters.length}`);
}

checkSupabaseNested().catch(console.error);
