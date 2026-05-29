const axios = require('axios');
const crypto = require('crypto');
const admin = require('../config/admin');
const { keyId, keySecret } = require('../config/razorpay');

function registerPaymentRoutes(app) {
  app.post('/createOrder', async (req, res) => {
    const { amount = 2900, currency = 'INR', email = null, phone = null } = req.body;

    try {
      const resp = await axios.post('https://api.razorpay.com/v1/orders', {
        amount,
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          email: email || '',
          phone: phone || '',
        },
        payment_capture: 1,
      }, {
        auth: {
          username: keyId,
          password: keySecret,
        },
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

      const expected = crypto.createHmac('sha256', keySecret).update(`${order_id}|${payment_id}`).digest('hex');
      if (expected !== signature) {
        return res.status(400).json({ success: false, error: 'signature_mismatch' });
      }

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
        await admin.auth().setCustomUserClaims(finalUid, { paid: true });

        await admin.firestore().collection('users').doc(finalUid).set({
          email: email || null,
          phone: phone || null,
          hasPaid: true,
          amountPaid: amount || null,
          accessGrantedBy: 'user_payment',
          lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error('auth user create/update error', err);
      }

      await admin.firestore().collection('subscriptions').add({
        uid: finalUid || null,
        email: email || null,
        phone: phone || null,
        amount: amount || null,
        order_id,
        payment_id,
        signature,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({ success: true, uid: finalUid, email: email || null });
    } catch (err) {
      console.error('verifyPayment error', err);
      return res.status(500).json({ success: false, error: 'verify_failed' });
    }
  });
}

module.exports = registerPaymentRoutes;