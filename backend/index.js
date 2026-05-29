const functions = require('firebase-functions');
require('./src/config/admin');
const app = require('./src/app');

exports.api = functions.https.onRequest(app);
