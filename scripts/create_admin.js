#!/usr/bin/env node
/*
  create_admin.js
  Usage:
    Set environment variable `GOOGLE_APPLICATION_CREDENTIALS` pointing to your service account JSON file.
    Then run:
      node scripts/create_admin.js --email admin@example.com --password StrongPass123 --name "Admin Name" [--phone +911234567890]

  This script will:
  - create a Firebase Auth user with the provided email/password
  - set a custom claim `role: 'admin'`
  - create/merge a document in `admins/{uid}` with basic metadata

  Note: Keep your service account JSON private. Do not commit it to source control.
*/

const admin = require('firebase-admin');
const fs = require('fs');

function usageAndExit(msg) {
  if (msg) console.error(msg);
  console.error('\nUsage: node scripts/create_admin.js --email admin@example.com --password Pass123 --name "Admin" [--phone +91...]');
  process.exit(msg ? 1 : 0);
}

// Simple arg parsing
const args = {};
process.argv.slice(2).forEach((a) => {
  if (!a.startsWith('--')) return;
  const keyVal = a.replace(/^--/, '').split('=');
  const key = keyVal[0];
  const val = keyVal[1] !== undefined ? keyVal[1] : null;
  args[key] = val;
});

// Also accept space-separated args
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--') && !a.includes('=')) {
    const key = a.replace(/^--/, '');
    const val = process.argv[i+1] && !process.argv[i+1].startsWith('--') ? process.argv[i+1] : null;
    if (val) { args[key] = val; i++; }
  }
}

if (!args.email || !args.password || !args.name) {
  usageAndExit('Missing required parameters: --email, --password and --name');
}

// Initialize admin SDK. It will automatically use GOOGLE_APPLICATION_CREDENTIALS if set.
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} catch (err) {
  // ignore if already initialized
}

async function run() {
  try {
    console.log('Creating admin user for', args.email);
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(args.email);
      console.log('User already exists. Will update and assign admin role. UID:', userRecord.uid);
    } catch (e) {
      userRecord = await admin.auth().createUser({
        email: args.email,
        password: args.password,
        displayName: args.name,
        phoneNumber: args.phone || undefined,
        emailVerified: true
      });
      console.log('Created user:', userRecord.uid);
    }

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log('Assigned custom claim role=admin');

    // Create admin doc in Firestore
    const db = admin.firestore();
    await db.collection('admins').doc(userRecord.uid).set({
      name: args.name,
      email: args.email,
      phone: args.phone || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('Admin document created/updated in Firestore (admins/', userRecord.uid, ')');

    console.log('\nAdmin account ready. You can sign in with:');
    console.log('  email:', args.email);
    console.log('  password:', args.password);
    console.log('\nFor security, consider resetting the password after first login.');
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

run();
