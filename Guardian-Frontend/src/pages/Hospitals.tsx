import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2, Plus, X, Phone, MapPin } from 'lucide-react';
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

  if (loading) return <div className="text-center mt-8 text-white font-medium">Loading hospital data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Available Hospitals</h1>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 p-2.5 rounded-xl flex items-center justify-center px-6 transition-all shadow-lg shadow-green-900/20 font-semibold"
        >
          <Plus size={20} className="mr-2" /> Add Hospital
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 sm:p-6 relative group transition-all hover:border-blue-500/50">
            
            <div className="absolute top-4 right-4 flex space-x-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEditClick(hospital)} className="p-1.5 bg-gray-700/50 rounded-lg text-blue-400 hover:text-blue-300">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(hospital.id)} className="p-1.5 bg-gray-700/50 rounded-lg text-red-400 hover:text-red-300">
                <Trash2 size={18} />
              </button>
            </div>

            <h2 className="text-xl font-bold mb-3 pr-16 leading-tight">{hospital.name}</h2>
            
            <div className="space-y-2 mb-5">
                <p className="flex items-start text-gray-400 text-sm">
                    <MapPin size={16} className="mr-2 mt-0.5 shrink-0 text-blue-500" />
                    {hospital.address}
                </p>
                <p className="flex items-center text-gray-400 text-sm">
                    <Phone size={16} className="mr-2 shrink-0 text-blue-500" />
                    {hospital.contact_number}
                </p>
            </div>

            <div className="flex justify-between items-center mb-6 p-3 bg-gray-900/50 rounded-xl text-sm">
              <div className="text-center flex-1 border-r border-gray-700">
                <p className="text-gray-500 text-[10px] uppercase font-bold">Total</p>
                <p className="text-gray-200 font-semibold">{hospital.total_beds}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold">Available</p>
                <p className="text-green-400 font-bold">{hospital.available_beds}</p>
              </div>
            </div>

            <button
              onClick={() => { setSelectedHospital(hospital); setIsBooking(true); }}
              disabled={hospital.available_beds === 0}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                hospital.available_beds > 0 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20" 
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {hospital.available_beds > 0 ? "Book Bed Now" : "No Beds Available"}
            </button>
          </div>
        ))}
      </div>

      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{isEditing ? 'Edit Hospital' : 'Add New Hospital'}</h2>
                <button onClick={resetHospitalForm} className="text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveHospital} className="space-y-4">
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Hospital Name</label>
                  <input type="text" placeholder="e.g. City Care Center" value={hospitalForm.name} onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
                  <input type="text" placeholder="Full Street Address" value={hospitalForm.address} onChange={(e) => setHospitalForm({...hospitalForm, address: e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Emergency Contact</label>
                  <input type="text" placeholder="Phone number" value={hospitalForm.contact_number} onChange={(e) => setHospitalForm({...hospitalForm, contact_number: e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Total Beds</label>
                  <input type="number" min="0" value={hospitalForm.total_beds} onChange={(e) => setHospitalForm({...hospitalForm, total_beds: +e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Available</label>
                  <input type="number" min="0" max={hospitalForm.total_beds} value={hospitalForm.available_beds} onChange={(e) => setHospitalForm({...hospitalForm, available_beds: +e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="flex-1 bg-green-600 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 order-1 sm:order-2">Save Details</button>
                <button type="button" onClick={resetHospitalForm} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all order-2 sm:order-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {isBooking && selectedHospital && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Book Bed: {selectedHospital.name}</h2>
                <button onClick={() => setIsBooking(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Patient Name</label>
                  <input type="text" placeholder="Full name of patient" value={bookingData.patient_name} onChange={(e) => setBookingData({...bookingData, patient_name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Primary Contact</label>
                  <input type="tel" placeholder="Mobile number" value={bookingData.contact_number} onChange={(e) => setBookingData({...bookingData, contact_number: e.target.value})} className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 order-1 sm:order-2">Confirm Booking</button>
                <button type="button" onClick={() => {setIsBooking(false); setSelectedHospital(null);}} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all order-2 sm:order-1">Go Back</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;