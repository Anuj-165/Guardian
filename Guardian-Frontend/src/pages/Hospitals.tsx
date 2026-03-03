import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2, Plus } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

interface Hospital {
  id: string;
  name: string;
  address: string;
  contact_number: string;
  total_beds: number;
  available_beds: number;
}

const Hospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    address: '',
    contact_number: '',
    total_beds: 0,
    available_beds: 0,
  });

  const [bookingData, setBookingData] = useState({
    patient_name: '',
    contact_number: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchHospitals();
  }, [user, navigate]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await API.get<Hospital[]>('/hospitals');
      const sortedData = [...response.data].sort((a, b) => a.name.localeCompare(b.name));
      setHospitals(sortedData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  const resetHospitalForm = () => {
    setHospitalForm({ name: '', address: '', contact_number: '', total_beds: 0, available_beds: 0 });
    setIsFormOpen(false);
    setIsEditing(false);
    setSelectedHospital(null);
  };

  const handleEditClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setHospitalForm({
      name: hospital.name,
      address: hospital.address,
      contact_number: hospital.contact_number,
      total_beds: hospital.total_beds,
      available_beds: hospital.available_beds,
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleSaveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedHospital) {
        await API.put(`/hospitals/${selectedHospital.id}`, hospitalForm);
        toast.success('Hospital updated');
      } else {
        await API.post('/hospitals', hospitalForm);
        toast.success('Hospital added');
      }
      resetHospitalForm();
      fetchHospitals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this hospital?')) return;
    try {
      await API.delete(`/hospitals/${id}`);
      toast.success('Hospital deleted');
      fetchHospitals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital || !user) return;
    try {
      await API.post('/bookings', {
        hospital_id: selectedHospital.id,
        user_id: user.id,
        patient_name: bookingData.patient_name,
        contact_number: bookingData.contact_number,
        booking_date: new Date().toISOString(),
      });
      toast.success('Booking successful!');
      setIsBooking(false);
      setSelectedHospital(null);
      setBookingData({ patient_name: '', contact_number: '' });
      fetchHospitals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="text-center mt-8 text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Hospitals</h1>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-green-600 hover:bg-green-700 p-2 rounded-full flex items-center px-4 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add Hospital
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-gray-800 rounded-lg p-6 relative group">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEditClick(hospital)} className="text-blue-400 hover:text-blue-300">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(hospital.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={18} />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-2 pr-12">{hospital.name}</h2>
            <p className="text-gray-400 mb-1">{hospital.address}</p>
            <p className="text-gray-400 mb-4">Contact: {hospital.contact_number}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Total: {hospital.total_beds}</span>
              <span className="text-green-400">Available: {hospital.available_beds}</span>
            </div>
            <button
              onClick={() => { setSelectedHospital(hospital); setIsBooking(true); }}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Book Bed
            </button>
          </div>
        ))}
      </div>

      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Hospital' : 'Add New Hospital'}</h2>
            <form onSubmit={handleSaveHospital} className="space-y-4">
              <input type="text" placeholder="Hospital Name" value={hospitalForm.name} onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
              <input type="text" placeholder="Address" value={hospitalForm.address} onChange={(e) => setHospitalForm({...hospitalForm, address: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
              <input type="text" placeholder="Contact Number" value={hospitalForm.contact_number} onChange={(e) => setHospitalForm({...hospitalForm, contact_number: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
              <div className="flex gap-4">
                <div className="flex-1"><label className="text-xs">Total Beds</label>
                  <input type="number" value={hospitalForm.total_beds} onChange={(e) => setHospitalForm({...hospitalForm, total_beds: +e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                </div>
                <div className="flex-1"><label className="text-xs">Available Beds</label>
                  <input type="number" value={hospitalForm.available_beds} onChange={(e) => setHospitalForm({...hospitalForm, available_beds: +e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700 transition-colors">Save</button>
                <button type="button" onClick={resetHospitalForm} className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-700 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {isBooking && selectedHospital && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Book Bed: {selectedHospital.name}</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <input type="text" placeholder="Patient Name" value={bookingData.patient_name} onChange={(e) => setBookingData({...bookingData, patient_name: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
              <input type="tel" placeholder="Contact Number" value={bookingData.contact_number} onChange={(e) => setBookingData({...bookingData, contact_number: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700">Confirm</button>
                <button type="button" onClick={() => {setIsBooking(false); setSelectedHospital(null);}} className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;