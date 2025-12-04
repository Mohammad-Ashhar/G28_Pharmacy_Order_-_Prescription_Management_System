export default function DeliveryDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg mb-2">Pending Deliveries</h3>
          <p className="text-4xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg mb-2">Completed Today</h3>
          <p className="text-4xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg mb-2">Total Deliveries</h3>
          <p className="text-4xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
