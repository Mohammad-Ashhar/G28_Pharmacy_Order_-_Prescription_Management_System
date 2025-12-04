import { useState, useEffect } from 'react';
import { orderAPI, prescriptionAPI } from '../../services/api';

export default function PharmacistDashboard() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    pendingPrescriptions: 0,
    todayOrders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, prescriptionsRes] = await Promise.all([
        orderAPI.getAll(),
        prescriptionAPI.getAll()
      ]);

      const orders = ordersRes.data;
      const prescriptions = prescriptionsRes.data;

      // Calculate stats
      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'verified').length;
      const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;
      
      const today = new Date().toDateString();
      const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;
      
      const revenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({ pendingOrders, pendingPrescriptions, todayOrders, revenue });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pharmacist Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Pending Prescriptions</p>
              <p className="text-3xl font-bold">{stats.pendingPrescriptions}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Today's Orders</p>
              <p className="text-3xl font-bold">{stats.todayOrders}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Revenue</p>
              <p className="text-3xl font-bold">${stats.revenue.toFixed(0)}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.orderId}</td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{order.items.length}</td>
                  <td className="py-3 px-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
