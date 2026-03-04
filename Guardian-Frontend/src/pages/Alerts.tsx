import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, AlertCircle, Info, Plus, X } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  location: string;
  active: boolean;
  created_at: string;
}

interface Weather {
  temp: number;
  city: string;
  condition: string;
  icon: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    location: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    Promise.all([fetchAlerts(), fetchWeather()]).finally(() => setLoading(false));
  }, [user, navigate]);

  const fetchWeather = async () => {
    try {
      const response = await API.get('/weather?city=Delhi');
      setWeather(response.data);
    } catch (error) {
      console.error("Weather update failed");
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await API.get<Alert[]>('/alerts');
      const sortedData = [...response.data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAlerts(sortedData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch alerts');
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/alerts', formData);
      toast.success('Alert broadcasted successfully');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', severity: 'medium', location: '' });
      fetchAlerts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create alert');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />;
      case 'medium': return <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />;
      default: return <Info className="w-6 h-6 text-blue-500 shrink-0" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500/10 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  if (loading) return <div className="text-center mt-8 text-white">Loading data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      
      {weather && (
        <div className="mb-6 sm:mb-8 bg-gray-800/50 border border-blue-500/30 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg backdrop-blur-sm gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img src={weather.icon} alt="Weather icon" className="w-12 h-12 sm:w-16 sm:h-16" />
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{weather.temp}°C</h3>
              <p className="text-blue-400 font-medium text-sm sm:text-base">{weather.city} — {weather.condition}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-gray-400 text-xs sm:text-sm">Live Monitoring Active</p>
            <p className="text-green-400 text-[10px] sm:text-xs font-mono animate-pulse">● System Online</p>
          </div>
        </div>
      )}

      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Crisis Alerts</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center transition-colors font-semibold"
        >
          <Plus size={20} className="mr-2" /> Create Alert
        </button>
      </div>

      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-4 sm:p-6 transition-all hover:scale-[1.01] ${getSeverityColor(alert.severity)}`}>
            {/* Mobile: Icon on top or Side-by-side depending on screen */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-white leading-tight">{alert.title}</h2>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded self-start ${alert.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {alert.active ? 'Active' : 'Archived'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base mb-4 break-words">{alert.description}</p>
                <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-400 gap-2">
                  <span className="flex items-center">📍 {alert.location}</span>
                  <span>
                    {new Date(alert.created_at).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Issue Emergency Alert</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <input 
                type="text" placeholder="Alert Title" 
                className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-red-500 text-sm sm:text-base"
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required 
              />
              <textarea 
                placeholder="Detailed Description" rows={3}
                className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-red-500 text-sm sm:text-base"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select 
                  className="p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-red-500 text-sm"
                  value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}
                >
                  <option value="low">Low Severity</option>
                  <option value="medium">Medium Severity</option>
                  <option value="high">High Severity</option>
                </select>
                <input 
                  type="text" placeholder="Location" 
                  className="p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-red-500 text-sm"
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required 
                />
              </div>
              <button type="submit" className="w-full bg-red-600 py-3 rounded-lg font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 mt-2">
                Broadcast Emergency Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;