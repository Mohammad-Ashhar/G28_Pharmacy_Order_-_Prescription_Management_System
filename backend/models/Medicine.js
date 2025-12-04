import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  brand: String,
  category: { type: String, enum: ['OTC', 'Prescription', 'Supplement'], default: 'OTC' },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  symptoms: [String],
  dosage: String,
  sideEffects: String,
  manufacturer: String,
  expiryDate: Date,
  requiresPrescription: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Medicine', medicineSchema);
