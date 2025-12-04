import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PharmacistLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white fixed h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xl font-bold">Pharmacist</span>
          </div>

          <nav className="space-y-2">
            <Link to="/pharmacist" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              Dashboard
            </Link>
            <Link to="/pharmacist/orders" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              Orders
            </Link>
            <Link to="/pharmacist/prescriptions" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              Prescriptions
            </Link>
            <Link to="/pharmacist/medicines" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              Medicines
            </Link>
            <Link to="/pharmacist/inventory" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              Inventory
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs text-blue-200">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
