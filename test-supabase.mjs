import fetch from 'node-fetch';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjg0NzcsImV4cCI6MjA4OTk0NDQ3N30.EQmHpS5esPhdi_Cd9OtYusMs58r9J4GG-0j5JC5riqc';

const headers = {
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
};

// Test 1: Count
console.log('Test 1: Contando party_resources...');
const countUrl = `${SUPABASE_URL}/rest/v1/party_resources?select=count()`;
const countRes = await fetch(countUrl, { headers });
const countData = await countRes.json();
console.log('Status:', countRes.status);
console.log('Data:', countData);

// Test 2: Get all
console.log('\nTest 2: Obteniendo primeros 5 registros...');
const dataUrl = `${SUPABASE_URL}/rest/v1/party_resources?limit=5&select=id,party_id,title,type`;
const dataRes = await fetch(dataUrl, { headers });
const data = await dataRes.json();
console.log('Status:', dataRes.status);
console.log('Registros:', data.length);
if (data && Array.isArray(data) && data.length > 0) {
  console.log('Sample:', JSON.stringify(data[0], null, 2));
}
