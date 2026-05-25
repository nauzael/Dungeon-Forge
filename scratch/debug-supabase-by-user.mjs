import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Read all characters from Supabase
  const { data: characters, error: charError } = await supabase
    .from('characters')
    .select('id, user_id, data, party_id, updated_at, deleted_at')
    .is('deleted_at', null);

  if (charError) {
    console.error('Error fetching characters:', charError);
    return;
  }

  // Get all unique user UIDs from characters
  const uids = [...new Set(characters.map(c => c.user_id))];
  console.log(`\n==========================================`);
  console.log(`SUPABASE CHARACTERS BY EMAIL:`);

  for (const uid of uids) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(uid);
    const email = userData?.user?.email || `Unknown (${uid})`;
    const userChars = characters.filter(c => c.user_id === uid);
    const names = userChars.map(c => {
      const d = typeof c.data === 'string' ? JSON.parse(c.data) : c.data;
      return d?.name || c.id;
    });

    console.log(`- ${email} (Supabase UID: ${uid})`);
    console.log(`  Names: ${names.join(', ')}`);
  }
  console.log(`==========================================\n`);
}

main().catch(console.error);
