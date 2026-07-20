require('dotenv').config();
const path = require('path');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const db = admin.firestore();
// Safety net: silently drop `undefined` fields instead of throwing, so an
// accidental undefined somewhere in the payment sync never crashes a
// mid-flight payment record write.
db.settings({ ignoreUndefinedProperties: true });
const bucket = admin.storage().bucket();

module.exports = { db, bucket, admin };
