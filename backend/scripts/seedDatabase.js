import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleMedicines = [
  {
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    brand: 'Tylenol',
    category: 'OTC',
    description: 'Pain reliever and fever reducer',
    price: 8.99,
    stock: 150,
    symptoms: ['headache', 'fever', 'pain'],
    dosage: '500mg every 4-6 hours',
    manufacturer: 'Johnson & Johnson',
    requiresPrescription: false
  },
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brand: 'Advil',
    category: 'OTC',
    description: 'Anti-inflammatory pain reliever',
    price: 12.99,
    stock: 120,
    symptoms: ['inflammation', 'pain', 'fever'],
    dosage: '200-400mg every 4-6 hours',
    manufacturer: 'Pfizer',
    requiresPrescription: false
  },
  {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brand: 'Amoxil',
    category: 'Prescription',
    description: 'Antibiotic for bacterial infections',
    price: 24.99,
    stock: 80,
    symptoms: ['bacterial infection', 'respiratory infection'],
    dosage: '500mg three times daily',
    manufacturer: 'GlaxoSmithKline',
    requiresPrescription: true
  },
  {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brand: 'Prinivil',
    category: 'Prescription',
    description: 'ACE inhibitor for high blood pressure',
    price: 19.99,
    stock: 60,
    symptoms: ['hypertension', 'heart failure'],
    dosage: '10-40mg once daily',
    manufacturer: 'Merck',
    requiresPrescription: true
  },
  {
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    brand: 'Nature Made',
    category: 'Supplement',
    description: 'Vitamin D supplement',
    price: 14.99,
    stock: 200,
    symptoms: ['vitamin deficiency', 'bone health'],
    dosage: '1000 IU daily',
    manufacturer: 'Nature Made',
    requiresPrescription: false
  },
  {
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brand: 'Prilosec',
    category: 'OTC',
    description: 'Proton pump inhibitor for heartburn',
    price: 16.99,
    stock: 90,
    symptoms: ['heartburn', 'acid reflux', 'GERD'],
    dosage: '20mg once daily',
    manufacturer: 'AstraZeneca',
    requiresPrescription: false
  },
  {
    name: 'Metformin',
    genericName: 'Metformin',
    brand: 'Glucophage',
    category: 'Prescription',
    description: 'Diabetes medication',
    price: 22.99,
    stock: 70,
    symptoms: ['type 2 diabetes', 'blood sugar control'],
    dosage: '500-2000mg daily',
    manufacturer: 'Bristol-Myers Squibb',
    requiresPrescription: true
  },
  {
    name: 'Cetirizine',
    genericName: 'Cetirizine',
    brand: 'Zyrtec',
    category: 'OTC',
    description: 'Antihistamine for allergies',
    price: 11.99,
    stock: 110,
    symptoms: ['allergies', 'hay fever', 'hives'],
    dosage: '10mg once daily',
    manufacturer: 'Johnson & Johnson',
    requiresPrescription: false
  },
  {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    brand: 'Lipitor',
    category: 'Prescription',
    description: 'Statin for cholesterol management',
    price: 28.99,
    stock: 65,
    symptoms: ['high cholesterol', 'cardiovascular disease'],
    dosage: '10-80mg once daily',
    manufacturer: 'Pfizer',
    requiresPrescription: true
  },
  {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    brand: 'Bayer',
    category: 'OTC',
    description: 'Pain reliever and blood thinner',
    price: 7.99,
    stock: 180,
    symptoms: ['pain', 'fever', 'heart attack prevention'],
    dosage: '81-325mg daily',
    manufacturer: 'Bayer',
    requiresPrescription: false
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI.replace('<db_password>', 'your_password_here'));
    console.log('Connected to MongoDB');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Insert sample medicines
    await Medicine.insertMany(sampleMedicines);
    console.log(`Inserted ${sampleMedicines.length} sample medicines`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
