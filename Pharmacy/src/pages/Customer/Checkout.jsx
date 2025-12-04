import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { orderAPI, prescriptionAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState('');
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const hasRxItems = cart.some(item => item.requiresPrescription);

  useEffect(() => {
    if (hasRxItems) {
      fetchPrescriptions();
    }
  }, [hasRxItems]);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionAPI.getMyPrescriptions();
      // Filter only verified prescriptions
      setPrescriptions(response.data.filter(p => p.status === 'verified'));
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (hasRxItems && !selectedPrescription) {
      setError('Please select a verified prescription for prescription medicines');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          medicineId: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: deliveryType === 'delivery' ? address : null,
        deliveryType,
        prescriptionId: selectedPrescription || null
      };

      await orderAPI.create(orderData);
      
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Prescription Selection */}
        {hasRxItems && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Prescription</h2>
            {prescriptions.length > 0 ? (
              <select
                value={selectedPrescription}
                onChange={(e) => setSelectedPrescription(e.target.value)}
                required={hasRxItems}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a verified prescription</option>
                {prescriptions.map(prescription => (
                  <option key={prescription._id} value={prescription._id}>
                    {prescription.doctorName || 'Prescription'} - {new Date(prescription.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-800">
                  You don't have any verified prescriptions. Please upload and get a prescription verified first.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delivery Type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDeliveryType('delivery')}
              className={`p-4 border-2 rounded-lg transition ${
                deliveryType === 'delivery'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="font-semibold">Home Delivery</p>
                <p className="text-sm text-gray-600">FREE</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryType('pickup')}
              className={`p-4 border-2 rounded-lg transition ${
                deliveryType === 'pickup'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="font-semibold">Store Pickup</p>
                <p className="text-sm text-gray-600">Ready in 2 hours</p>
              </div>
            </button>
          </div>
        </div>

        {/* Delivery Address */}
        {deliveryType === 'delivery' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  name="street"
                  type="text"
                  required
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                name="city"
                type="text"
                required
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="state"
                type="text"
                required
                value={address.state}
                onChange={handleAddressChange}
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="zipCode"
                type="text"
                required
                value={address.zipCode}
                onChange={handleAddressChange}
                placeholder="ZIP Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone"
                type="tel"
                required
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>${(getTotalPrice() * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span className="text-blue-600">${(getTotalPrice() * 1.18).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
