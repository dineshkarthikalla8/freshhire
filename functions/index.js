const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const multer = require('multer');
const pdfParse = require('pdf-parse');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const RAZORPAY_KEY_ID = functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET;

app.post('/createOrder', async (req, res) => {
  const { amount = 2900, currency = 'INR', email = null, phone = null } = req.body;
  try {
    const resp = await axios.post('https://api.razorpay.com/v1/orders', {
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        email: email || '',
        phone: phone || ''
      },
      payment_capture: 1
    }, {
      auth: {
        username: RAZORPAY_KEY_ID,
        password: RAZORPAY_KEY_SECRET
      }
    });

    return res.json(resp.data);
  } catch (err) {
    console.error('createOrder error', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'order_create_failed' });
  }
});

app.post('/verifyPayment', async (req, res) => {
  const { order_id, payment_id, signature, uid: clientUid, email, phone, amount } = req.body;
  try {
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ success: false, error: 'missing_fields' });
    }

    const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${order_id}|${payment_id}`).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ success: false, error: 'signature_mismatch' });
    }

    // Ensure an Auth user exists for this email. If not, create one.
    let finalUid = clientUid || null;
    try {
      let userRecord = null;
      if (email) {
        try {
          userRecord = await admin.auth().getUserByEmail(email);
        } catch (e) {
          // user not found
        }
      }

      if (!userRecord) {
        const randomPassword = crypto.randomBytes(8).toString('hex');
        const createParams = { email: email || undefined, emailVerified: false, password: randomPassword };
        if (phone) createParams.phoneNumber = phone;
        userRecord = await admin.auth().createUser(createParams);
      }

      finalUid = userRecord.uid;

      // Mark paid via custom claim
      await admin.auth().setCustomUserClaims(finalUid, { paid: true });

      // Ensure a user document exists and mark as paid
      await admin.firestore().collection('users').doc(finalUid).set({
        email: email || null,
        phone: phone || null,
        hasPaid: true,
        amountPaid: amount || null,
        accessGrantedBy: 'user_payment',
        lastPaymentAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

    } catch (err) {
      console.error('auth user create/update error', err);
    }

    // Record verified subscription in Firestore
    await admin.firestore().collection('subscriptions').add({
      uid: finalUid || null,
      email: email || null,
      phone: phone || null,
      amount: amount || null,
      order_id,
      payment_id,
      signature,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ success: true, uid: finalUid, email: email || null });
  } catch (err) {
    console.error('verifyPayment error', err);
    return res.status(500).json({ success: false, error: 'verify_failed' });
  }
});

// One-time bootstrap endpoint to create/promote an admin user.
// Protect this with a secret in functions config: `firebase functions:config:set bootstrap.secret="your_secret"`
app.post('/bootstrapAdmin', async (req, res) => {
  const { secret, email, password, name, phone } = req.body || {};
  const BOOTSTRAP_SECRET = functions.config().bootstrap?.secret || process.env.BOOTSTRAP_SECRET;
  if (!BOOTSTRAP_SECRET || secret !== BOOTSTRAP_SECRET) {
    return res.status(403).json({ success: false, error: 'forbidden' });
  }

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'missing_email_or_password' });
  }

  try {
    let userRecord = null;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (e) {
      // not found
    }

    if (!userRecord) {
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name || undefined,
        phoneNumber: phone || undefined,
        emailVerified: true
      });
    }

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });

    await admin.firestore().collection('admins').doc(userRecord.uid).set({
      email,
      name: name || null,
      phone: phone || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.json({ success: true, uid: userRecord.uid, email });
  } catch (err) {
    console.error('bootstrapAdmin error', err);
    return res.status(500).json({ success: false, error: 'bootstrap_failed' });
  }
});

app.post('/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'file_missing' });
    }

    const parsed = await pdfParse(req.file.buffer);
    const text = (parsed.text || '').replace(/\s+\n/g, '\n').trim();

    return res.json({
      text,
      pages: parsed.numpages || 0,
      info: parsed.info || {}
    });
  } catch (err) {
    console.error('extract-text error', err);
    return res.status(500).json({ error: 'extract_failed' });
  }
});

exports.api = functions.https.onRequest(app);
