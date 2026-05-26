#!/usr/bin/env node

/**
 * List all tables in Supabase
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

  console.log('📋 Listing all tables in Supabase...\n');

  // Query information_schema to list tables
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (error) {
    console.log('Alternative method: trying to list via RPC...');
    
    // Try with a raw SQL query through Supabase
    const { data: tableList, error: tableError } = await supabase
      .rpc('get_tables');
    
    if (tableError) {
      console.log('RPC method failed. Let me try fetching from auth.users to verify connection...');
      const { data: users, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .limit(1);
      
      if (userError) {
        console.log('Error:', userError.message);
      } else {
        console.log('✅ Connection works. Let me try with different table names...');
      }
    } else {
      console.log('Tables:', tableList);
    }
  } else {
    console.log('✅ Tables found:');
    data.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
