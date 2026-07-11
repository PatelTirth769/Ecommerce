require('dotenv').config();
const express = require('express');
const cors = require('cors');

const paymentRoutes = require('./src/routes/payment.routes');
const orderRoutes = require('./src/routes/order.routes');
const sellerRoutes = require('./src/routes/seller.routes');

const app = express();
const PORT = process.env.PORT || 3636;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);

// Health check endpointr
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
