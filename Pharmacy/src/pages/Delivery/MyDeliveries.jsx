import { useState, useEffect } from 'react';
import { deliveryAPI } from '../../services/api';

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await deliveryAPI.getMyDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, status) => {
    try {
      await deliveryAPI.updateStatus(deliveryId, { status });
      await fetchDeliveries();
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleVerifyOTP = async (deliveryId) => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    try {
      await deliveryAPI.verifyOTP(deliveryId, { otp });
      await fetchDeliveries();
      setOtp('');
      setSelectedDelivery(null);
      alert('Delivery completed successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Deliveries</h1>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">No deliveries assigned</h2>
          <p className="mt-2 text-gray-600">Check back later for new deliveries</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map(delivery => (
            <div key={delivery._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
                <h3 className="font-semibold text-lg">{delivery.orderId}</h3>
                <p className="text-sm opacity-90">{delivery.items.length} items</p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-medium text-sm mt-1">
                    {delivery.deliveryAddress?.street}<br />
                    {delivery.deliveryAddress?.city}, {delivery.deliveryAddress?.state}
                  </p>
                  <p className="text-sm mt-1">📞 {delivery.deliveryAddress?.phone}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold mt-1 ${
                    delivery.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                    delivery.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {delivery.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {delivery.status === 'assigned' && (
                  <button
                    onClick={() => handleStatusUpdate(delivery._id, 'picked_up')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition mb-2"
                  >
                    Mark as Picked Up
                  </button>
                )}

                {delivery.status === 'picked_up' && (
                  <button
                    onClick={() => setSelectedDelivery(delivery)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                  >
                    Complete Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTP Verification Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDelivery(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Complete Delivery</h2>
            <p className="text-gray-600 mb-4">
              Order: <strong>{selectedDelivery.orderId}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Enter the OTP provided by the customer to complete delivery
            </p>
            
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              maxLength="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl font-bold mb-4"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedDelivery(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyOTP(selectedDelivery._id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Verify & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
