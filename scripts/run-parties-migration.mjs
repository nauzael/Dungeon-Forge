#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const steps = [
  { n: 1, cmd: 'node', args: ['scripts/migrate-parties-to-firebase.mjs'], env: { DRY_RUN: 'true' }, desc: 'DRY-RUN: Parties' },
  { n: 2, cmd: 'node', args: ['scripts/migrate-parties-to-firebase.mjs'], env: {}, desc: 'MIGRATE: Parties' },
  { n: 3, cmd: 'node', args: ['scripts/migrate-party-codes-to-firebase.mjs'], env: { DRY_RUN: 'true' }, desc: 'DRY-RUN: Codes' },
  { n: 4, cmd: 'node', args: ['scripts/migrate-party-codes-to-firebase.mjs'], env: {}, desc: 'MIGRATE: Codes' },
  { n: 5, cmd: 'node', args: ['scripts/migrate-party-resources-to-firebase.mjs', '--dry-run'], env: {}, desc: 'DRY-RUN: Resources' },
  { n: 6, cmd: 'node', args: ['scripts/migrate-party-resources-to-firebase.mjs'], env: {}, desc: 'MIGRATE: Resources' }
];

console.log('\n🚀 PARTIES MIGRATION ORCHESTRATOR\n');

let completed = 0;
for (const s of steps) {
  console.log(`[${s.n}/6] ${s.desc}`);
  const env = { ...process.env, ...s.env };
  const r = spawnSync(s.cmd, s.args, { cwd: root, env, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\n❌ Step ${s.n} failed`);
    process.exit(1);
  }
  completed++;
  console.log(`✅ Step ${s.n} complete\n`);
}

console.log('🎉 ALL 6 MIGRATIONS COMPLETE!\n');
