// Script para ejecutar SQL directamente en Supabase usando la Service Key
// Uso: node scripts/run_migration.js

const https = require('https');

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

const sql = `
CREATE TABLE IF NOT EXISTS party_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  type TEXT DEFAULT 'Setting',
  description TEXT,
  is_persistent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_party_resources_party_id ON party_resources(party_id);
CREATE INDEX IF NOT EXISTS idx_party_resources_persistent ON party_resources(party_id, is_persistent);

ALTER TABLE party_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insert resources" ON party_resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Select resources" ON party_resources FOR SELECT USING (true);
CREATE POLICY "Delete resources" ON party_resources FOR DELETE USING (true);
CREATE POLICY "Update resources" ON party_resources FOR UPDATE USING (true);
`;

const data = JSON.stringify({ query: sql });

const options = {
  hostname: 'usnlhzkpukkuwbtortil.supabase.co',
  port: 443,
  path: '/rest/v1/rpc/exec',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Length': data.length,
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
