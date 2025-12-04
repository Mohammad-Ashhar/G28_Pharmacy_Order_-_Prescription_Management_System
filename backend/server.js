import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import pkg from 'pg';
const { Pool } = pkg;

// Import routes
import authRoutes from './routes/auth.js';
import medicineRoutes from './routes/medicines.js';
import prescriptionRoutes from './routes/prescriptions.js';
import orderRoutes from './routes/orders.js';
import inventoryRoutes from './routes/inventory.js';
import deliveryRoutes from './routes/delivery.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection (for users, billing, transactions)
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// MongoDB Connection (for products, orders, prescriptions)
mongoose.connect(process.env.MONGODB_URI.replace('<db_password>', 'your_password_here'))
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test PostgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err);
  } else {
    console.log('✅ PostgreSQL connected');
  }
});

// Initialize database tables
import('./config/initDB.js');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pharmacy API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
