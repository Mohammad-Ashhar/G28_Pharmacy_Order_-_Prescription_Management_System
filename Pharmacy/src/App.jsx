import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Customer Pages
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/Customer/Home';
import MedicineCatalog from './pages/Customer/MedicineCatalog';
import UploadPrescription from './pages/Customer/UploadPrescription';
import Cart from './pages/Customer/Cart';
import Checkout from './pages/Customer/Checkout';
import MyOrders from './pages/Customer/MyOrders';
import MyPrescriptions from './pages/Customer/MyPrescriptions';

// Pharmacist Pages
import PharmacistLayout from './layouts/PharmacistLayout';
import PharmacistDashboard from './pages/Pharmacist/Dashboard';
import OrderManagement from './pages/Pharmacist/OrderManagement';
import PrescriptionVerification from './pages/Pharmacist/PrescriptionVerification';
import InventoryManagement from './pages/Pharmacist/InventoryManagement';
import MedicineManagement from './pages/Pharmacist/MedicineManagement';

// Delivery Agent Pages
import DeliveryLayout from './layouts/DeliveryLayout';
import DeliveryDashboard from './pages/Delivery/Dashboard';
import MyDeliveries from './pages/Delivery/MyDeliveries';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="medicines" element={<MedicineCatalog />} />
            <Route path="upload-prescription" element={<UploadPrescription />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="my-prescriptions" element={<MyPrescriptions />} />
          </Route>

          {/* Pharmacist Routes */}
          <Route path="/pharmacist" element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacistLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PharmacistDashboard />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="prescriptions" element={<PrescriptionVerification />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="medicines" element={<MedicineManagement />} />
          </Route>

          {/* Delivery Agent Routes */}
          <Route path="/delivery" element={
            <ProtectedRoute allowedRoles={['delivery_agent']}>
              <DeliveryLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DeliveryDashboard />} />
            <Route path="my-deliveries" element={<MyDeliveries />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
