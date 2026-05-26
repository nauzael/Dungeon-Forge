#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import fetch from 'node-fetch';
import admin from 'firebase-admin';

/**
 * ONDA 3: Party Resources Migration - Mapas/Imágenes del DM
 * 
 * Migra party_resources de Supabase a Firebase:
 * 1. Descargar imágenes de Supabase Storage
 * 2. Upload a Firebase Storage
 * 3. Guardar metadata en Firestore
 * 4. Validar integridad
 */

const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync('./dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json', 'utf-8'));
const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
// SERVICE_KEY has admin privileges for downloading files from Supabase Storage
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const MAX_PARALLEL = 5;

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  projectId: 'dungeon-forge-prod',
  storageBucket: 'dungeon-forge-prod.firebasestorage.app',
});

const db = admin.firestore();
const storage = admin.storage().bucket();

// ═══════════════════════════════════════════════════════════════════════════

class PartyResourcesMigration {
  constructor() {
    this.startTime = new Date();
    this.stats = {
      resourcesInSupabase: 0,
      resourcesInFirebase: 0,
      filesDownloaded: 0,
      filesUploaded: 0,
      metadataWritten: 0,
      failed: [],
      skipped: [],
      totalSize: 0,
    };
    this.resources = [];
    this.firebaseResources = {};
  }

  async run() {
    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║   ONDA 3: PARTY RESOURCES MIGRATION               ║`);
    console.log(`║   ${DRY_RUN ? 'DRY-RUN' : 'LIVE'} Mode - $(new Date().toISOString().split('T')[0])                       ║`);
    console.log(`╚═══════════════════════════════════════════════════╝\n`);

    try {
      // 1. Auditar party_resources en Supabase
      console.log('📊 PASO 1: Auditando party_resources en Supabase...');
      await this.auditSupabase();

      // 2. Contar resources en Firebase (ya migradores)
      console.log('\n📊 PASO 2: Contando resources en Firebase...');
      await this.countFirebaseResources();

      // 3. Analizar URLs (Supabase Storage vs externas)
      console.log('\n📊 PASO 3: Analizando origen de archivos...');
      await this.analyzeStorageUrls();

      // 4. DRY-RUN: Preview
      if (DRY_RUN) {
        console.log('\n💾 PASO 4: Preview de descarga/upload (DRY-RUN)...');
        await this.dryRunMigration();
      } else {
        // 5. LIVE: Migrate
        console.log('\n💾 PASO 4: Migrando resources...');
        await this.liveMigration();

        // 6. LIVE: Validate
        console.log('\n✅ PASO 5: Validando integridad...');
        await this.validateMigration();
      }

      // Report
      this.printReport();
    } catch (err) {
      console.error('\n❌ ERROR:', err.message);
      if (VERBOSE) console.error(err.stack);
      process.exit(1);
    }
  }

  async auditSupabase() {
    const headers = {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Prefer': 'count=estimated',
    };

    // Get count using HEAD request
    const countUrl = `${SUPABASE_URL}/rest/v1/party_resources?select=id`;
    const countRes = await fetch(countUrl, { headers, method: 'HEAD' });
    this.stats.resourcesInSupabase = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0');
    console.log(`   ✓ Total resources en Supabase: ${this.stats.resourcesInSupabase}`);

    // Get all resources
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjg0NzcsImV4cCI6MjA4OTk0NDQ3N30.EQmHpS5esPhdi_Cd9OtYusMs58r9J4GG-0j5JC5riqc';
    const anonHeaders = {
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'apikey': anonKey,
    };
    
    let offset = 0;
    const pageSize = 100;
    while (offset < this.stats.resourcesInSupabase) {
      const dataUrl = `${SUPABASE_URL}/rest/v1/party_resources?offset=${offset}&limit=${pageSize}&select=*`;
      const dataRes = await fetch(dataUrl, { headers: anonHeaders });
      const pageData = await dataRes.json();
      this.resources.push(...pageData);
      offset += pageSize;
    }

    console.log(`   ✓ Cargados ${this.resources.length} registros`);
    
    // Show sample
    if (this.resources.length > 0 && VERBOSE) {
      console.log(`\n   📋 Sample (primer registro):`);
      const r = this.resources[0];
      console.log(`      id: ${r.id}`);
      console.log(`      party_id: ${r.party_id}`);
      console.log(`      title: ${r.title}`);
      console.log(`      type: ${r.type}`);
      console.log(`      is_persistent: ${r.is_persistent}`);
      console.log(`      url: ${r.url?.substring(0, 80)}...`);
    }
  }

  async countFirebaseResources() {
    try {
      const partiesSnap = await db.collection('parties').get();
      let count = 0;
      for (const partyDoc of partiesSnap.docs) {
        const resourcesSnap = await partyDoc.ref.collection('resources').get();
        const partyId = partyDoc.id;
        count += resourcesSnap.size;
        this.firebaseResources[partyId] = resourcesSnap.size;
      }
      this.stats.resourcesInFirebase = count;
      console.log(`   ✓ Resources en Firebase: ${count}`);
    } catch (err) {
      console.log(`   ⚠ Firebase read skipped (admin SDK): ${err.code}`);
      this.stats.resourcesInFirebase = 0;
    }
  }

  async analyzeStorageUrls() {
    const supabaseCount = this.resources.filter(r => r.url?.includes('supabase.co/storage')).length;
    const externalCount = this.resources.filter(r => r.url && !r.url.includes('supabase.co/storage')).length;
    const noUrl = this.resources.filter(r => !r.url).length;

    console.log(`   ✓ URLs de Supabase Storage: ${supabaseCount}`);
    console.log(`   ✓ URLs externas: ${externalCount}`);
    console.log(`   ✓ Sin URL: ${noUrl}`);

    if (supabaseCount > 0) {
      console.log(`   ℹ Se descarga/uploadearán: ${supabaseCount} archivos`);
    }
  }

  async dryRunMigration() {
    const supabaseResources = this.resources.filter(r => r.url?.includes('supabase.co/storage'));
    console.log(`\n   📥 Preview: ${supabaseResources.length} archivos a descargar...`);

    let totalSizeMb = 0;
    for (const r of supabaseResources.slice(0, 5)) { // Sample 5
      try {
        const headRes = await fetch(r.url, { method: 'HEAD', timeout: 5000 });
        const contentLength = parseInt(headRes.headers.get('content-length') || '0');
        const sizeMb = (contentLength / 1024 / 1024).toFixed(2);
        totalSizeMb += contentLength;
        console.log(`      • ${r.title}: ${sizeMb} MB`);
      } catch (err) {
        console.log(`      • ${r.title}: ⚠ No accessible (HEAD failed)`);
      }
    }

    const estimatedTotal = (totalSizeMb / 1024 / 1024).toFixed(2);
    console.log(`   ℹ Tamaño estimado total (basado en sample): ~${estimatedTotal} MB`);
    console.log(`   ℹ Operaciones en paralelo: max ${MAX_PARALLEL}`);
    console.log(`   ✓ DRY-RUN completado. Sin escrituras.`);
  }

  async liveMigration() {
    const supabaseResources = this.resources.filter(r => r.url?.includes('supabase.co/storage'));
    const externalResources = this.resources.filter(r => r.url && !r.url.includes('supabase.co/storage'));

    console.log(`\n   📦 Migrando ${supabaseResources.length} + ${externalResources.length} resources...`);

    // Process in batches
    const batch = supabaseResources.slice(0, MAX_PARALLEL);
    let processed = 0;

    for (let i = 0; i < supabaseResources.length; i += MAX_PARALLEL) {
      const chunk = supabaseResources.slice(i, i + MAX_PARALLEL);
      await Promise.all(chunk.map(r => this.migrateResource(r)));
      processed += chunk.length;
      console.log(`   ⏳ Progreso: ${processed}/${supabaseResources.length}`);
    }

    // External URLs: only update metadata
    console.log(`\n   🔗 Procesando ${externalResources.length} URLs externas...`);
    for (const r of externalResources) {
      await this.writeMetadata(r);
    }

    console.log(`   ✓ Migración completada`);
  }

  async migrateResource(resource) {
    try {
      // Download from Supabase
      const buffer = await this.downloadFromSupabase(resource.url);
      this.stats.filesDownloaded++;

      // Upload to Firebase Storage
      const firebaseStoragePath = `party-resources/${resource.party_id}/${resource.id}/${this.extractFilename(resource.url)}`;
      const firebaseUrl = await this.uploadToFirebaseStorage(buffer, firebaseStoragePath, resource);
      this.stats.filesUploaded++;

      // Write metadata to Firestore
      await this.writeMetadata({
        ...resource,
        url: firebaseUrl, // Update with new URL
      });
      this.stats.metadataWritten++;
    } catch (err) {
      this.stats.failed.push({
        id: resource.id,
        title: resource.title,
        error: err.message,
      });
      console.log(`      ❌ Failed: ${resource.title} - ${err.message}`);
    }
  }

  async downloadFromSupabase(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : require('http');
      
      protocol.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        res.on('error', reject);
      }).on('error', reject);
    });
  }

  async uploadToFirebaseStorage(buffer, path, resource) {
    const file = storage.file(path);
    
    const metadata = {
      contentType: this.detectMimeType(path),
      metadata: {
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceType: resource.type,
        migratedAt: new Date().toISOString(),
      },
    };

    await file.save(buffer, { metadata });
    
    // Maximum allowed expiration: 7 days (604800 seconds)
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days max
    });
    return url;
  }

  async writeMetadata(resource) {
    const docRef = db.collection('parties').doc(resource.party_id)
      .collection('resources').doc(resource.id);

    const data = {
      resourceType: resource.type,
      name: resource.title,
      url: resource.url,
      isPersistent: resource.is_persistent || false,
      metadata: {
        migratedFromSupabase: true,
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    };

    if (!DRY_RUN) {
      await docRef.set(data, { merge: true });
    }
  }

  async validateMigration() {
    console.log(`\n   🔍 Validando integridad...`);

    // 1. Firestore count
    const firebaseCountBefore = this.stats.resourcesInFirebase;
    let firebaseCountAfter = 0;
    const partiesSnap = await db.collection('parties').get();
    for (const partyDoc of partiesSnap.docs) {
      const resourcesSnap = await partyDoc.ref.collection('resources').get();
      firebaseCountAfter += resourcesSnap.size;
    }

    console.log(`\n   📊 Recuento:`);
    console.log(`      Supabase antes: ${this.stats.resourcesInSupabase}`);
    console.log(`      Firebase antes: ${firebaseCountBefore}`);
    console.log(`      Firebase después: ${firebaseCountAfter}`);
    console.log(`      Nuevos agregados: ${firebaseCountAfter - firebaseCountBefore}`);

    // 2. Spot-check 5 random
    console.log(`\n   🎯 Spot-check (5 recursos aleatorios):`);
    const sample = this.resources.sort(() => Math.random() - 0.5).slice(0, 5);
    for (const resource of sample) {
      try {
        const docSnap = await db.collection('parties').doc(resource.party_id)
          .collection('resources').doc(resource.id).get();
        
        if (docSnap.exists) {
          const data = docSnap.data();
          const match = data.name === resource.title;
          console.log(`      ✓ ${resource.title}: ${match ? 'MATCH' : 'MISMATCH'}`);
        } else {
          console.log(`      ✗ ${resource.title}: NOT FOUND in Firebase`);
        }
      } catch (err) {
        console.log(`      ⚠ ${resource.title}: ${err.message}`);
      }
    }

    // 3. Storage URLs accessible
    console.log(`\n   🌐 Verificando accesibilidad de URLs en Firebase Storage...`);
    let accessibleCount = 0;
    const sampleForAccess = this.resources.slice(0, 3);
    for (const resource of sampleForAccess) {
      try {
        const docSnap = await db.collection('parties').doc(resource.party_id)
          .collection('resources').doc(resource.id).get();
        if (docSnap.exists && docSnap.data().url) {
          const url = docSnap.data().url;
          const headRes = await fetch(url, { method: 'HEAD', timeout: 5000 });
          if (headRes.status === 200) {
            accessibleCount++;
            console.log(`      ✓ ${resource.title}: Accessible`);
          } else {
            console.log(`      ⚠ ${resource.title}: HTTP ${headRes.status}`);
          }
        }
      } catch (err) {
        console.log(`      ⚠ ${resource.title}: ${err.message}`);
      }
    }
    console.log(`      Accesibles: ${accessibleCount}/${sampleForAccess.length}`);
  }

  extractFilename(url) {
    return url.split('/').pop() || `resource-${Date.now()}`;
  }

  detectMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  printReport() {
    const duration = ((new Date() - this.startTime) / 1000).toFixed(1);
    console.log(`\n╔════════════════════════════════════════════════════╗`);
    console.log(`║          MIGRATION REPORT - Party Resources      ║`);
    console.log(`╚════════════════════════════════════════════════════╝\n`);

    console.log(`⏱  Duration: ${duration}s`);
    console.log(`📦 Supabase: ${this.stats.resourcesInSupabase} resources`);
    console.log(`💾 Downloaded: ${this.stats.filesDownloaded}`);
    console.log(`📤 Uploaded: ${this.stats.filesUploaded}`);
    console.log(`📝 Metadata written: ${this.stats.metadataWritten}`);
    console.log(`❌ Failed: ${this.stats.failed.length}`);

    if (this.stats.failed.length > 0) {
      console.log(`\n⚠  Failures:`);
      this.stats.failed.forEach(f => {
        console.log(`    - ${f.title} (${f.id}): ${f.error}`);
      });
    }

    console.log(`\n${DRY_RUN ? '✅ DRY-RUN COMPLETED' : '✅ MIGRATION COMPLETED'}`);
    console.log(`${DRY_RUN ? 'Re-run sin --dry-run para migración LIVE' : 'Resources migrados exitosamente'}\n`);

    // Save report
    const reportPath = `./migration-logs/wave3-party-resources-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      dryRun: DRY_RUN,
      duration: `${duration}s`,
      stats: this.stats,
    }, null, 2));
    console.log(`📋 Report saved: ${reportPath}\n`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════

// RUN
const migration = new PartyResourcesMigration();
await migration.run();
