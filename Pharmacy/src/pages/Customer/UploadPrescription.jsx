import { useState } from 'react';
import { prescriptionAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function UploadPrescription() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('prescription', file);
      formData.append('doctorName', doctorName);
      formData.append('prescriptionDate', prescriptionDate);

      await prescriptionAPI.upload(formData);
      setSuccess('Prescription uploaded successfully! Awaiting pharmacist verification.');
      
      // Reset form
      setFile(null);
      setPreview('');
      setDoctorName('');
      setPrescriptionDate('');

      setTimeout(() => {
        navigate('/my-prescriptions');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Prescription</h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Prescription Image/PDF *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, or PDF up to 5MB</p>
              </label>
            </div>

            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>

          {/* Doctor Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name (Optional)
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prescription Date (Optional)
              </label>
              <input
                type="date"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Important Guidelines:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Ensure the prescription is clear and readable</li>
              <li>Include doctor's name, signature, and license number</li>
              <li>Prescription should be dated and valid</li>
              <li>All medicine names should be clearly visible</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </button>
        </form>
      </div>
    </div>
  );
}
