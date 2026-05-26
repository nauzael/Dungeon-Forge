#!/usr/bin/env node

/**
 * Audit party_codes in Supabase
 * Lists all party_codes to understand structure before migration
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('📋 Auditing party_codes in Supabase...\n');

  // Count total
  const { count, error: countError } = await supabase
    .from('party_codes')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to count: ${countError.message}`);
  }

  console.log(`✅ Total party_codes: ${count}\n`);

  // Fetch all
  const { data, error } = await supabase
    .from('party_codes')
    .select('*');

  if (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }

  console.log('📊 Sample data (first 5 records):');
  console.log(JSON.stringify(data.slice(0, 5), null, 2));

  console.log('\n📋 Schema Analysis:');
  if (data.length > 0) {
    const sample = data[0];
    console.log('Fields:', Object.keys(sample).join(', '));
    console.log('\nDetailed structure:');
    Object.entries(sample).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value} = ${JSON.stringify(value)}`);
    });
  }

  console.log('\n✅ Audit complete');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
