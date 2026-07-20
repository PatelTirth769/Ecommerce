const express = require('express');

// Razorpay webhook signature verification needs the exact raw request bytes,
// so this route must never go through express.json() body parsing.
const rawBodyMiddleware = express.raw({ type: 'application/json' });

module.exports = rawBodyMiddleware;
