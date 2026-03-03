import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    }
  };

  if (loading) return <div className="text-center mt-8 text-white">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
        {existingProfile ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-green-400">Your Volunteer Profile</h1>
            <div className="space-y-4 text-gray-300">
              <p><strong className="text-white">Name:</strong> {existingProfile.name}</p>
              <p><strong className="text-white">Availability:</strong> {existingProfile.availability}</p>
              <p><strong className="text-white">Contact:</strong> {existingProfile.contact_number}</p>
              <div>
                <strong className="text-white">Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {existingProfile.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setExistingProfile(null)} 
              className="mt-6 text-sm text-gray-400 hover:text-white underline"
            >
              Update Profile Information
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-white">Volunteer Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="First aid, driving, medical experience"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="anytime">Anytime</option>
                  <option value="oncall">On Call</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                Register as Volunteer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Volunteers;