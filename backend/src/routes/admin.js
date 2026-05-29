const admin = require('../config/admin');
const functions = require('firebase-functions');

function registerAdminRoutes(app) {
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
          emailVerified: true,
        });
      }

      await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });

      await admin.firestore().collection('admins').doc(userRecord.uid).set({
        email,
        name: name || null,
        phone: phone || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      return res.json({ success: true, uid: userRecord.uid, email });
    } catch (err) {
      console.error('bootstrapAdmin error', err);
      return res.status(500).json({ success: false, error: 'bootstrap_failed' });
    }
  });
}

module.exports = registerAdminRoutes;