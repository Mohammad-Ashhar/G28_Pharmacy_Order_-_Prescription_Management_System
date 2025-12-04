import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to PharmaCare</h1>
          <p className="text-xl mb-8 opacity-90">Your trusted partner for prescription management and medicine delivery</p>
          <div className="flex justify-center space-x-4">
            <Link to="/medicines" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Browse Medicines
            </Link>
            <Link to="/upload-prescription" className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition">
              Upload Prescription
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Prescription</h3>
            <p className="text-gray-600">Easily upload your doctor's prescription and we'll verify and process it</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Catalog</h3>
            <p className="text-gray-600">Browse our extensive collection of OTC medicines and healthcare products</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Orders</h3>
            <p className="text-gray-600">Real-time tracking of your orders from verification to delivery</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-20 w-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Upload Prescription</h3>
              <p className="text-sm text-gray-600">Upload a clear photo of your prescription</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Verification</h3>
              <p className="text-sm text-gray-600">Pharmacist verifies your prescription</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Order & Pay</h3>
              <p className="text-sm text-gray-600">Add to cart and complete payment</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-sm text-gray-600">Get your medicines delivered safely</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
