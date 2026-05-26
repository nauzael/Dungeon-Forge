#!/usr/bin/env node

/**
 * Firebase REST API Migration - Alternative to Admin SDK
 * 
 * Uses Firestore REST API to migrate parties without Admin SDK credentials
 * Requirements: VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID
 * 
 * Usage:
 *   node scripts/migrate-parties-rest-api.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Config
const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'dungeon-forge-prod';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

class FirestoreRestMigration {
  constructor() {
    this.firestoreBase = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    this.migratedCount = 0;
    this.timestamp = new Date().toISOString();
  }

  log(msg, data = null) {
    const ts = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${ts}] ${msg}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }

  error(msg, err) {
    const ts = new Date().toISOString().split('T')[1].split('.')[0];
    console.error(`[${ts}] ❌ ${msg}`);
    if (err) console.error(err.message || err);
  }

  section(title) {
    console.log('\n' + '='.repeat(80));
    console.log(title);
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    this.section('STEP 1: Validate Configuration');

    if (!FIREBASE_API_KEY) {
      this.error('Missing VITE_FIREBASE_API_KEY');
      return false;
    }
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      this.error('Missing Supabase credentials');
      return false;
    }

    this.log('✅ VITE_FIREBASE_API_KEY configured');
    this.log('✅ Supabase credentials configured');
    this.log(`✅ Project ID: ${PROJECT_ID}`);
    this.log(`✅ Firestore base: ${this.firestoreBase}`);

    return true;
  }

  /**
   * Fetch parties from Supabase
   */
  async fetchSupabaseParties() {
    this.section('STEP 2: Fetch Parties from Supabase');

    try {
      this.log('Querying Supabase parties table...');
      const { data, error } = await this.supabase
        .from('parties')
        .select('*');

      if (error) throw error;

      this.log(`✅ Found ${data.length} parties`);
      data.forEach((party, i) => {
        this.log(`  ${i + 1}. ${party.name} (code: ${party.code}, creator: ${party.creator_id})`);
      });

      return data;
    } catch (e) {
      this.error('Failed to fetch parties', e);
      return [];
    }
  }

  /**
   * Transform Supabase party to Firebase format
   */
  transformParty(supabaseParty) {
    const now = new Date().toISOString();
    
    return {
      name: {
        stringValue: supabaseParty.name
      },
      code: {
        stringValue: supabaseParty.code.toUpperCase()
      },
      id: {
        stringValue: supabaseParty.id
      },
      creator_id: {
        stringValue: supabaseParty.creator_id
      },
      dm_uid: {
        stringValue: supabaseParty.creator_id  // BUG FIX: Add dm_uid
      },
      members: {
        mapValue: { fields: {} }  // BUG FIX: Add members map
      },
      settings: {
        mapValue: { fields: {} }  // BUG FIX: Add settings
      },
      created_at: {
        stringValue: supabaseParty.created_at || now  // BUG FIX: ISO string
      },
      updated_at: {
        stringValue: supabaseParty.updated_at || now  // BUG FIX: ISO string
      }
    };
  }

  /**
   * Write party to Firestore via REST API
   */
  async writeToFirestore(partyId, partyData) {
    try {
      const url = `${this.firestoreBase}/parties/${partyId}?key=${FIREBASE_API_KEY}`;
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: partyData
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      return true;
    } catch (e) {
      throw new Error(`Failed to write to Firestore: ${e.message}`);
    }
  }

  /**
   * Create party code entry
   */
  async createPartyCode(code, partyId) {
    try {
      const url = `${this.firestoreBase}/party_codes/${code}?key=${FIREBASE_API_KEY}`;
      const now = new Date().toISOString();

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            code: { stringValue: code },
            party_id: { stringValue: partyId },
            created_at: { stringValue: now }
          }
        })
      });

      if (!response.ok) {
        const text = await response.text();
        this.error(`Failed to create party code: ${text}`);
      }
    } catch (e) {
      this.error(`Party code creation error: ${e.message}`);
    }
  }

  /**
   * Run migration
   */
  async migrate() {
    // Validate
    if (!this.validateConfig()) {
      process.exit(1);
    }

    // Fetch parties
    const parties = await this.fetchSupabaseParties();
    if (parties.length === 0) {
      this.log('No parties to migrate');
      process.exit(0);
    }

    // Migrate each party
    this.section('STEP 3: Migrate Parties to Firestore');

    for (const party of parties) {
      try {
        this.log(`Migrating: ${party.name} (${party.id})`);
        
        const transformed = this.transformParty(party);
        await this.writeToFirestore(party.id, transformed);
        await this.createPartyCode(party.code.toUpperCase(), party.id);
        
        this.log(`  ✅ Migrated`);
        this.migratedCount++;
      } catch (e) {
        this.error(`  ❌ Failed`, e);
      }
    }

    // Summary
    this.section('SUMMARY');
    this.log(`✅ Migration complete`);
    this.log(`   Total: ${this.migratedCount}/${parties.length} parties migrated`);

    if (this.migratedCount === parties.length) {
      this.log('\n🎉 All parties successfully migrated!');
      this.log('\nNext steps:');
      this.log('  1. npm run dev');
      this.log('  2. Test party create/join in app');
      this.log('  3. git add . && git commit && git push');
      process.exit(0);
    } else {
      this.error(`${parties.length - this.migratedCount} parties failed to migrate`);
      process.exit(1);
    }
  }
}

// Run migration
const migration = new FirestoreRestMigration();
migration.migrate().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
