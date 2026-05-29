const functions = require('firebase-functions');

const razorpayConfig = {
  keyId: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
  keySecret: functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET,
};

module.exports = razorpayConfig;