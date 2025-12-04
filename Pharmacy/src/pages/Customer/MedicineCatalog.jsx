import { useState, useEffect } from 'react';
import { medicineAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function MedicineCatalog() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, [search, category]);

  const fetchMedicines = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await medicineAPI.getAll(params);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    setNotification(`${medicine.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medicine Catalog</h1>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down">
          {notification}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search medicines, symptoms, or generic names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="OTC">Over the Counter (OTC)</option>
            <option value="Prescription">Prescription Required</option>
            <option value="Supplement">Supplements</option>
          </select>
        </div>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{medicine.name}</h3>
                  {medicine.requiresPrescription && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">Rx</span>
                  )}
                </div>
                {medicine.genericName && (
                  <p className="text-sm text-gray-500 mb-2">{medicine.genericName}</p>
                )}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{medicine.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${medicine.price}</span>
                  {medicine.stock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(medicine)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-sm"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {medicines.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No medicines found</p>
        </div>
      )}
    </div>
  );
}
