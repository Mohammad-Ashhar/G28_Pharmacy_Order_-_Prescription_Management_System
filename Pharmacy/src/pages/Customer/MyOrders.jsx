import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      assigned: 'bg-indigo-100 text-indigo-800',
      picked_up: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Verification',
      verified: 'Verified',
      processing: 'Processing',
      assigned: 'Assigned to Delivery',
      picked_up: 'Out for Delivery',
      delivered: 'Delivered',
      rejected: 'Rejected'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-gray-600">Start shopping to place your first order</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{order.orderId}</h3>
                    <p className="text-sm opacity-90 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(order.status)} text-sm`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-semibold mb-4">Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                {order.deliveryType === 'delivery' && order.deliveryAddress && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold mb-2">Delivery Address</h5>
                    <p className="text-sm text-gray-700">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">Phone: {order.deliveryAddress.phone}</p>
                  </div>
                )}

                {/* Total */}
                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</span>
                </div>

                {/* Order Timeline */}
                <div className="mt-6 pt-4 border-t">
                  <h5 className="font-semibold mb-3">Order Status Timeline</h5>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4">
                      {['pending', 'verified', 'processing', 'assigned', 'picked_up', 'delivered'].map((statusStep, index) => {
                        const isPassed = ['pending', 'verified', 'processing', 'assigned', 'picked_up', 'delivered'].indexOf(order.status) >= index;
                        return (
                          <div key={statusStep} className="relative flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPassed ? 'bg-green-500' : 'bg-gray-300'} z-10`}>
                              {isPassed && (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm ${isPassed ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                              {getStatusText(statusStep)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
