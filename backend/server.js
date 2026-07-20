require('dotenv').config();
const { validateEnv } = require('./src/config/env.validation');
validateEnv();

const express = require('express');
const cors = require('cors');

const paymentRoutes = require('./src/routes/payment.routes');
const orderRoutes = require('./src/routes/order.routes');
const paymentController = require('./src/controllers/payment.controller');
const rawBodyMiddleware = require('./src/middleware/rawBody');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3636;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Razorpay webhook signature verification needs the exact raw request bytes,
// so this one route is registered ahead of express.json() below and parses
// its own body via rawBodyMiddleware. Every other route gets normal JSON
// parsing from the global middleware that follows.
app.post('/api/payment/webhook', rawBodyMiddleware, paymentController.handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Backend Server running on port ${PORT}`);
});
