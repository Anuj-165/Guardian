import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  patient_name: string;
  contact_number: string;
  booking_date: string;
  status: string;
  hospital: {
    name: string;
  };
}

interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  availability: string;
  contact_number: string;
  created_at: string;
}

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.email !== 'admin@example.com') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [bookingsRes, volunteersRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/volunteers'),
      ]);

      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
      if (!volunteersRes.ok) throw new Error('Failed to fetch volunteers');

      const bookingsData = await bookingsRes.json();
      const volunteersData = await volunteersRes.json();

      setBookings(bookingsData || []);
      setVolunteers(volunteersData || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update booking');

      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast.success('Booking status updated');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Hospital Bookings
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'volunteers'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Volunteers
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.patient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.hospital?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateBookingStatus(booking.id, e.target.value)
                      }
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'volunteers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{volunteer.name}</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-medium">Skills:</span>{' '}
                  {volunteer.skills?.join(', ')}
                </p>
                <p>
                  <span className="font-medium">Availability:</span>{' '}
                  {volunteer.availability}
                </p>
                <p>
                  <span className="font-medium">Contact:</span>{' '}
                  {volunteer.contact_number}
                </p>
                <p className="text-sm text-gray-400">
                  Registered on:{' '}
                  {new Date(volunteer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;