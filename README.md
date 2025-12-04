# 🏥 Pharmacy Order & Prescription Management System

A comprehensive full-stack web application for managing pharmacy operations, including medicine ordering, prescription verification, inventory management, and delivery tracking.

## 👥 Team Members

| Role | Name | Responsibility |
|------|------|---------------|
| **Team Leader** | Mohammad Ashhar | Backend Architecture, Database Design, Core Server Setup |
| **Member 2** | Sumit Sahu | Authentication & Security, User Management, RBAC |
| **Member 3** | Abhishek Yadav | Customer Features, Shopping Cart, Order Management |
| **Member 4** | Gaurav Mittal | Prescription Processing, OCR Integration, Cloud Storage |
| **Member 5** | Pragyan Chandra Dhar | Pharmacist Portal, Inventory, Delivery System, Frontend Integration |

---

## 🚀 Features

### Customer Portal
- 🛒 Browse and search medicines with advanced filters
- 📋 Upload prescriptions with OCR text extraction
- 🛍️ Shopping cart with real-time stock checking
- 💳 Secure checkout and payment processing
- 📦 Order tracking with real-time status updates
- 📱 SMS notifications for order updates

### Pharmacist Dashboard
- ✅ Verify uploaded prescriptions
- 📊 Manage orders and update status
- 💊 CRUD operations for medicines
- 📈 Inventory management with low-stock alerts
- 📉 Analytics and reporting dashboard

### Delivery Agent Portal
- 🚚 View assigned deliveries
- 🔐 OTP-based delivery verification
- 📍 Real-time delivery status updates
- 📊 Delivery performance tracking

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **Vite 7** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database for products & orders
- **PostgreSQL (Neon)** - Relational database for users & billing
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Cloud Services & APIs
- **Google Cloud Storage** - Prescription image storage
- **Google Vision API** - OCR text extraction
- **Twilio** - SMS notifications
- **Stack Auth** - Authentication service

---

## 📁 Project Structure

```
PharmacyProject/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth & file upload middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Cloud storage & notifications
│   ├── scripts/         # Database seeding
│   └── server.js        # Express server entry point
│
├── Pharmacy/            # React frontend
│   ├── src/
│   │   ├── context/     # Global state management
│   │   ├── layouts/     # Role-based layouts
│   │   ├── pages/       # UI pages (Customer, Pharmacist, Delivery)
│   │   └── services/    # API client
│   └── public/
│
└── Documentation/
    ├── SETUP.md
    ├── ARCHITECTURE.md
    └── PROJECT_SUMMARY.md
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- PostgreSQL (Neon) account
- Google Cloud Platform account
- Twilio account

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your credentials

# Initialize database
npm run seed

# Start server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd Pharmacy

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your credentials

# Start development server
npm run dev
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Add new medicine (Pharmacist)
- `PUT /api/medicines/:id` - Update medicine (Pharmacist)
- `DELETE /api/medicines/:id` - Delete medicine (Pharmacist)

### Prescriptions
- `POST /api/prescriptions/upload` - Upload prescription
- `GET /api/prescriptions/my-prescriptions` - Get user prescriptions
- `PUT /api/prescriptions/:id/verify` - Verify prescription (Pharmacist)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders` - Get all orders (Pharmacist)
- `PUT /api/orders/:id/status` - Update order status

### Delivery
- `GET /api/delivery/my-deliveries` - Get assigned deliveries
- `PUT /api/delivery/:id/verify` - Verify delivery with OTP

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=your_postgresql_url
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLOUD_API_KEY=your_gcp_key
GOOGLE_VISION_API_KEY=your_vision_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### Frontend (.env)
```
VITE_STACK_PROJECT_ID=your_stack_project_id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_key
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 Database Schema

### MongoDB Collections
- **medicines** - Product catalog
- **prescriptions** - Uploaded prescriptions with OCR data
- **orders** - Customer orders
- **inventory** - Stock management

### PostgreSQL Tables
- **users** - User accounts with roles
- **billing** - Payment records
- **transactions** - Transaction history

---

## 🎯 User Roles

1. **Customer** - Browse medicines, upload prescriptions, place orders
2. **Pharmacist** - Verify prescriptions, manage inventory, process orders
3. **Delivery Agent** - View deliveries, update delivery status

---

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- API route protection
- Input validation
- Secure file uploads
- Environment variable protection

---

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

---

## 🚀 Deployment

### Backend
- Deploy on Railway, Render, or Heroku
- Configure environment variables
- Set up MongoDB Atlas and Neon PostgreSQL

### Frontend
- Deploy on Vercel or Netlify
- Update API URL in environment variables
- Configure domain settings

---

## 📄 License

This project is part of a college hackathon demonstration.

---

## 🙏 Acknowledgments

- Google Cloud Platform for storage and OCR services
- Twilio for SMS notifications
- MongoDB Atlas for database hosting
- Neon for PostgreSQL hosting
