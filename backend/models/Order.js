import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  userId: { type: Number, required: true },
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  items: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    name: String,
    quantity: Number,
    price: Number,
    requiresPrescription: Boolean
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  deliveryType: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
  status: {
    type: String,
    enum: ['pending', 'verified', 'processing', 'assigned', 'picked_up', 'delivered', 'rejected'],
    default: 'pending'
  },
  assignedTo: Number,
  deliverySignature: String,
  deliveryOTP: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
