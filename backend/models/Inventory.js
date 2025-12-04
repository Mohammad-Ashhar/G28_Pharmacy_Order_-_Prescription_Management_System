import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  reorderLevel: { type: Number, default: 10 },
  lastRestocked: { type: Date, default: Date.now },
  supplier: String,
  batchNumber: String,
  expiryDate: Date,
  location: String,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Inventory', inventorySchema);
