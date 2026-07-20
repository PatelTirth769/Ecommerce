const REQUIRED_VARS = [
  'RAZORPAY_KEY',
  'RAZORPAY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'FRONTEND_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_SERVICE_ACCOUNT_PATH',
  'ERPNEXT_BASE_URL',
  'ERPNEXT_API_KEY',
  'ERPNEXT_API_SECRET',
  'ERPNEXT_MODE_OF_PAYMENT',
  'ADMIN_RETRY_KEY'
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
      `Copy backend/.env.example to backend/.env and fill in real values before starting the server.`
    );
  }
}

module.exports = { validateEnv };
