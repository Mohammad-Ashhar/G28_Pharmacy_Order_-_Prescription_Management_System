import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  doctorName: String,
  doctorLicense: String,
  prescriptionDate: Date,
  imageUrl: { type: String, required: true },
  extractedText: String,
  medicines: [String],
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected', 'processing'],
    default: 'pending'
  },
  verifiedBy: Number,
  rejectionReason: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', prescriptionSchema);
