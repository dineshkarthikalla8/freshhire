const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const RAZORPAY_KEY_ID = functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET;

app.post('/createOrder', async (req, res) => {
  const { amount = 2900, currency = 'INR' } = req.body;
  try {
    const resp = await axios.post('https://api.razorpay.com/v1/orders', {
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
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
  const { order_id, payment_id, signature, uid, email, amount } = req.body;
  try {
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ success: false, error: 'missing_fields' });
    }

    const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${order_id}|${payment_id}`).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ success: false, error: 'signature_mismatch' });
    }

    // Record verified subscription in Firestore
    await admin.firestore().collection('subscriptions').add({
      uid: uid || null,
      email: email || null,
      amount: amount || null,
      order_id,
      payment_id,
      signature,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('verifyPayment error', err);
    return res.status(500).json({ success: false, error: 'verify_failed' });
  }
});

exports.api = functions.https.onRequest(app);
