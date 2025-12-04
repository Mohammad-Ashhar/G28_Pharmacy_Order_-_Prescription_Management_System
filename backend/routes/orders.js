import express from 'express';
import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import { pgPool } from '../server.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { sendOrderStatusUpdate } from '../utils/notifications.js';

const router = express.Router();

// Create new order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryType, prescriptionId } = req.body;
    
    // Calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ error: `Medicine ${item.medicineId} not found` });
      }
      
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${medicine.name}` 
        });
      }
      
      totalAmount += medicine.price * item.quantity;
      
      orderItems.push({
        medicineId: medicine._id,
        name: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
        requiresPrescription: medicine.requiresPrescription
      });
    }
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create order
    const order = new Order({
      orderId,
      userId: req.user.id,
      prescriptionId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      deliveryType,
      status: 'pending'
    });
    
    await order.save();
    
    // Update medicine stock
    for (const item of orderItems) {
      await Medicine.findByIdAndUpdate(
        item.medicineId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Create billing record
    const tax = totalAmount * 0.18; // 18% GST
    const total = totalAmount + tax;
    
    await pgPool.query(
      'INSERT INTO billing (order_id, user_id, amount, tax, total, payment_status) VALUES ($1, $2, $3, $4, $5, $6)',
      [orderId, req.user.id, totalAmount, tax, total, 'pending']
    );
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('prescriptionId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (pharmacist/admin only)
router.get('/', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('prescriptionId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('prescriptionId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check authorization
    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (pharmacist/delivery agent)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, notes, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get user phone for notification
    const userResult = await pgPool.query(
      'SELECT phone FROM users WHERE id = $1',
      [order.userId]
    );
    
    if (userResult.rows[0]?.phone) {
      try {
        await sendOrderStatusUpdate(userResult.rows[0].phone, order.orderId, status);
      } catch (smsError) {
        console.error('SMS notification error:', smsError);
      }
    }
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Assign order to delivery agent (pharmacist only)
router.put('/:id/assign', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo, 
        status: 'assigned',
        deliveryOTP: Math.floor(1000 + Math.random() * 9000).toString(),
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      message: 'Order assigned successfully',
      order
    });
  } catch (error) {
    console.error('Error assigning order:', error);
    res.status(500).json({ error: 'Failed to assign order' });
  }
});

export default router;
