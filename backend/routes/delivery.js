import express from 'express';
import Order from '../models/Order.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get assigned orders (delivery agent)
router.get('/my-deliveries', authenticate, authorize('delivery_agent'), async (req, res) => {
  try {
    const orders = await Order.find({ 
      assignedTo: req.user.id,
      status: { $in: ['assigned', 'picked_up'] }
    })
    .populate('prescriptionId')
    .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// Update delivery status
router.put('/:id/status', authenticate, authorize('delivery_agent'), async (req, res) => {
  try {
    const { status, signature } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    order.status = status;
    if (signature) {
      order.deliverySignature = signature;
    }
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.json({
      message: 'Delivery status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// Verify OTP for delivery
router.post('/:id/verify-otp', authenticate, authorize('delivery_agent'), async (req, res) => {
  try {
    const { otp } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    order.status = 'delivered';
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({
      message: 'Delivery verified successfully',
      order
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

export default router;
