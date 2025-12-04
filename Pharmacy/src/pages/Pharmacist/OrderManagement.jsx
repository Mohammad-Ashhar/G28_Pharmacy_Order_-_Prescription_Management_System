import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignAgent, setAssignAgent] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await orderAPI.getAll(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      await fetchOrders();
      setSelectedOrder(null);
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const handleAssignDelivery = async (orderId) => {
    if (!assignAgent) {
      alert('Please enter delivery agent ID');
      return;
    }

    try {
      await orderAPI.assign(orderId, { assignedTo: parseInt(assignAgent) });
      await fetchOrders();
      setSelectedOrder(null);
      setAssignAgent('');
      alert('Order assigned to delivery agent');
    } catch (error) {
      console.error('Error assigning order:', error);
      alert('Failed to assign order');
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
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex space-x-2">
          {['all', 'pending', 'verified', 'processing', 'assigned', 'picked_up', 'delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{order.orderId}</h3>
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                  {order.status}
                </span>
              </div>
              <p className="text-sm opacity-90 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm text-gray-600">Items</p>
                <p className="font-semibold">{order.items.length} items</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedOrder.orderId}</h2>
                  <p className="text-gray-600">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              {selectedOrder.deliveryAddress && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm">
                    {selectedOrder.deliveryAddress.street}<br />
                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.zipCode}<br />
                    Phone: {selectedOrder.deliveryAddress.phone}
                  </p>
                </div>
              )}

              {/* Status Actions */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['verified', 'processing', 'rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                      className={`px-4 py-2 rounded-lg transition ${
                        status === 'rejected'
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Delivery */}
              <div>
                <h3 className="font-semibold mb-3">Assign to Delivery Agent</h3>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={assignAgent}
                    onChange={(e) => setAssignAgent(e.target.value)}
                    placeholder="Enter delivery agent ID"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleAssignDelivery(selectedOrder._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
