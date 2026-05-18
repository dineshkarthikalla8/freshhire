#!/usr/bin/env node
// Usage:
// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
// node scripts/add_admin_doc.cjs --id N39tPDMCjEamGBvoopOf --field Required --value "String"

const admin = require('firebase-admin');

// simple arg parsing
const args = {};
process.argv.slice(2).forEach((a, idx, arr) => {
  if (!a.startsWith('--')) return;
  const key = a.replace(/^--/, '');
  const val = arr[idx+1] && !arr[idx+1].startsWith('--') ? arr[idx+1] : null;
  args[key] = val;
});

if (!args.id || !args.field || args.value === undefined) {
  console.error('Missing args. Example: --id DOCID --field Required --value "String"');
  process.exit(1);
}

try {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
} catch (e) {}

async function run() {
  const db = admin.firestore();
  const docRef = db.collection('admins').doc(args.id);
  const payload = {};
  payload[args.field] = args.value;
  payload.createdAt = admin.firestore.FieldValue.serverTimestamp();

  await docRef.set(payload, { merge: true });
  console.log('Wrote admins/' + args.id, payload);
}

run().catch(err => { console.error('Error:', err); process.exit(1); });
