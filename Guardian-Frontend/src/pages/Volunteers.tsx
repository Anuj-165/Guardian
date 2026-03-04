import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Hammer, Calendar, Phone, CheckCircle, Loader2 } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

interface VolunteerProfile {
  name: string;
  skills: string[];
  availability: string;
  contact_number: string;
}

const Volunteers = () => {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    availability: '',
    contact_number: '',
  });
  const [existingProfile, setExistingProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyProfile();
  }, [user, navigate]);

  const fetchMyProfile = async () => {
    try {
      const response = await API.get<VolunteerProfile>('/volunteers/me');
      if (response.data) {
        setExistingProfile(response.data);
      }
    } catch (error: any) {
      console.log("No existing profile found");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await API.post('/volunteers/register', {
        user_id: user?.id,
        name: formData.name,
        skills: formData.skills.split(',').map((s) => s.trim()),
        availability: formData.availability,
        contact_number: formData.contact_number,
      });

      toast.success('Thank you for volunteering!');
      fetchMyProfile(); 
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-gray-800 rounded-2xl p-6 sm:p-10 shadow-2xl border border-gray-700">
        {existingProfile ? (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-full">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Volunteer Profile</h1>
                <p className="text-green-400 text-sm font-medium italic">Active Responder</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <User size={18} className="text-blue-400" /> {existingProfile.name}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Availability</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <Calendar size={18} className="text-purple-400" /> {existingProfile.availability}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Emergency Contact</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <Phone size={18} className="text-green-400" /> {existingProfile.contact_number}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Skills & Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {existingProfile.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm border border-blue-500/30 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => {
                  setFormData({
                    name: existingProfile.name,
                    skills: existingProfile.skills.join(', '),
                    availability: existingProfile.availability,
                    contact_number: existingProfile.contact_number
                  });
                  setExistingProfile(null);
                }} 
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center mx-auto gap-2"
              >
                Need to update your info? <span className="underline">Edit Profile</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Join the Network</h1>
              <p className="text-gray-400 mt-2">Fill out your details to help in times of crisis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Skills (comma-separated)</label>
                <div className="relative">
                  <Hammer className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="First aid, Nursing, Logistics..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">General Availability</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-gray-500 z-10" size={18} />
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-gray-800">Select availability</option>
                    <option value="weekdays" className="bg-gray-800">Weekdays</option>
                    <option value="weekends" className="bg-gray-800">Weekends</option>
                    <option value="anytime" className="bg-gray-800">Anytime</option>
                    <option value="oncall" className="bg-gray-800">On Call</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input
                    type="tel"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-900/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Registering...
                  </>
                ) : (
                  'Confirm Registration'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Volunteers;