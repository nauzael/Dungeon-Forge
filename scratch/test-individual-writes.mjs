import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: characters, error: charError } = await supabase
    .from('characters')
    .select('id, user_id, data, party_id, updated_at, deleted_at')
    .is('deleted_at', null);

  if (charError) {
    console.error('Error fetching from Supabase:', charError);
    return;
  }

  console.log(`Leídos ${characters.length} personajes. Probando escrituras individuales...`);

  for (const char of characters) {
    const charData = typeof char.data === 'string' ? JSON.parse(char.data) : char.data;
    try {
      const docRef = db.collection('characters_test_temp').doc(char.id);
      await docRef.set({
        id: char.id,
        user_id: 'test-user-id',
        data: charData,
        party_id: char.party_id || null,
        updated_at: admin.firestore.Timestamp.fromDate(new Date(char.updated_at || Date.now())),
        deleted_at: char.deleted_at ? admin.firestore.Timestamp.fromDate(new Date(char.deleted_at)) : null,
      });
      console.log(`✅ OK: Character "${charData?.name || char.id}" (ID: ${char.id})`);
      // Delete the test document to clean up
      await docRef.delete();
    } catch (e) {
      console.error(`❌ ERROR: Character "${charData?.name || char.id}" (ID: ${char.id})`);
      console.error(`Reason:`, e);
      console.log(`Character data dump:`, JSON.stringify(charData, null, 2));
    }
  }
}

main().catch(console.error);
