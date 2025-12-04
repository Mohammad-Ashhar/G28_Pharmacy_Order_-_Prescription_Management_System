import express from 'express';
import Inventory from '../models/Inventory.js';
import Medicine from '../models/Medicine.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all inventory
router.get('/', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('medicineId');
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add inventory item
router.post('/', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    
    // Update medicine stock
    await Medicine.findByIdAndUpdate(
      req.body.medicineId,
      { $inc: { stock: req.body.quantity } }
    );
    
    res.status(201).json({
      message: 'Inventory added successfully',
      inventory
    });
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).json({ error: 'Failed to add inventory' });
  }
});

// Update inventory
router.put('/:id', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const oldInventory = await Inventory.findById(req.params.id);
    const quantityDiff = req.body.quantity - oldInventory.quantity;
    
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    // Update medicine stock
    if (quantityDiff !== 0) {
      await Medicine.findByIdAndUpdate(
        inventory.medicineId,
        { $inc: { stock: quantityDiff } }
      );
    }
    
    res.json({
      message: 'Inventory updated successfully',
      inventory
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Get low stock items
router.get('/low-stock', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const lowStock = await Inventory.find()
      .populate('medicineId')
      .where('quantity').lte(10);
    
    res.json(lowStock);
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

export default router;
