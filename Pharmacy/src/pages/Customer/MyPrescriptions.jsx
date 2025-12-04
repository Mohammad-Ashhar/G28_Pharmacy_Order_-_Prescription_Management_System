import { useState, useEffect } from 'react';
import { prescriptionAPI } from '../../services/api';

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionAPI.getMyPrescriptions();
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <h1 className="text-3xl font-bold mb-8">My Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">No prescriptions yet</h2>
          <p className="mt-2 text-gray-600">Upload your first prescription to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {prescriptions.map(prescription => (
            <div key={prescription._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Prescription Image */}
              <div className="h-64 bg-gray-100 relative">
                <img
                  src={prescription.imageUrl}
                  alt="Prescription"
                  className="w-full h-full object-contain"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-lg font-semibold text-sm ${getStatusColor(prescription.status)}`}>
                  {prescription.status.toUpperCase()}
                </span>
              </div>

              {/* Prescription Details */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Uploaded on</p>
                  <p className="font-semibold">{new Date(prescription.createdAt).toLocaleDateString()}</p>
                </div>

                {prescription.doctorName && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-semibold">{prescription.doctorName}</p>
                  </div>
                )}

                {prescription.extractedText && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Extracted Text (AI)</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
                      {prescription.extractedText}
                    </div>
                  </div>
                )}

                {prescription.status === 'rejected' && prescription.rejectionReason && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3">
                    <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-700">{prescription.rejectionReason}</p>
                  </div>
                )}

                {prescription.notes && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3">
                    <p className="text-sm font-semibold text-blue-800 mb-1">Pharmacist Notes</p>
                    <p className="text-sm text-blue-700">{prescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
