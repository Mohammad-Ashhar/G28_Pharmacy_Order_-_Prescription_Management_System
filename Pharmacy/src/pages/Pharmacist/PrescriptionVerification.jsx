import { useState, useEffect } from 'react';
import { prescriptionAPI } from '../../services/api';

export default function PrescriptionVerification() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionAPI.getAll({ status: 'pending' });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    if (!selectedPrescription) return;

    setVerifying(true);
    try {
      await prescriptionAPI.verify(selectedPrescription._id, {
        status,
        notes,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined
      });

      // Refresh list
      await fetchPrescriptions();
      setSelectedPrescription(null);
      setNotes('');
      setRejectionReason('');
    } catch (error) {
      console.error('Error verifying prescription:', error);
      alert('Failed to verify prescription');
    } finally {
      setVerifying(false);
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
      <h1 className="text-3xl font-bold mb-8">Prescription Verification</h1>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">All caught up!</h2>
          <p className="mt-2 text-gray-600">No pending prescriptions to verify</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Prescription List */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-md p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="font-semibold mb-4">Pending Prescriptions ({prescriptions.length})</h2>
            <div className="space-y-3">
              {prescriptions.map(prescription => (
                <div
                  key={prescription._id}
                  onClick={() => setSelectedPrescription(prescription)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedPrescription?._id === prescription._id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium">User ID: {prescription.userId}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </p>
                  {prescription.doctorName && (
                    <p className="text-sm text-gray-600">Dr. {prescription.doctorName}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Details */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            {selectedPrescription ? (
              <div>
                <h2 className="text-xl font-semibold mb-6">Prescription Details</h2>

                {/* Prescription Image */}
                <div className="mb-6">
                  <img
                    src={selectedPrescription.imageUrl}
                    alt="Prescription"
                    className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                  />
                </div>

                {/* Extracted Text */}
                {selectedPrescription.extractedText && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Extracted Text (AI)</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-48 overflow-y-auto">
                      {selectedPrescription.extractedText}
                    </div>
                  </div>
                )}

                {/* Doctor Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {selectedPrescription.doctorName && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Doctor Name</label>
                      <p className="mt-1">{selectedPrescription.doctorName}</p>
                    </div>
                  )}
                  {selectedPrescription.prescriptionDate && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Prescription Date</label>
                      <p className="mt-1">{new Date(selectedPrescription.prescriptionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* Verification Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Add any notes about this prescription..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="2"
                      placeholder="Reason for rejection..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleVerify('verified')}
                      disabled={verifying}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {verifying ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleVerify('rejected')}
                      disabled={verifying || !rejectionReason}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a prescription to verify
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
