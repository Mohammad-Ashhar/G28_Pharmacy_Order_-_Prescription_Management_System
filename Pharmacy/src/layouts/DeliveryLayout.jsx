import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DeliveryLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-600 to-green-800 text-white fixed h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <span className="text-xl font-bold">Delivery</span>
          </div>

          <nav className="space-y-2">
            <Link to="/delivery" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              Dashboard
            </Link>
            <Link to="/delivery/my-deliveries" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition">
              My Deliveries
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs text-green-200">{user?.email}</p>
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
