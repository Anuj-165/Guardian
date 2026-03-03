import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, X } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

interface Resource {
  id: string;
  type: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    quantity: 0,
    unit: '',
    location: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchResources();
  }, [user, navigate]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await API.get<Resource[]>('/resources');
      const sortedData = [...response.data].sort((a, b) => a.type.localeCompare(b.type));
      setResources(sortedData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/resources', formData);
      toast.success('Resource added successfully');
      setIsModalOpen(false);
      setFormData({ type: '', name: '', quantity: 0, unit: '', location: '' });
      fetchResources();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add resource');
    }
  };

  const getResourceTypes = () => {
    const types = new Set(resources.map((r) => r.type));
    return ['all', ...Array.from(types)];
  };

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter((r) => r.type === filter);

  if (loading) return <div className="text-center mt-8 text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Available Resources</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" /> Add Resource
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2 outline-none border border-gray-600 focus:border-blue-500"
            >
              {getResourceTypes().map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-500 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{resource.name}</h2>
                <span className="inline-block bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-800 uppercase tracking-wider">
                  {resource.type}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-400">{resource.quantity}</span>
                <span className="text-gray-400 ml-1 text-sm">{resource.unit}</span>
              </div>
            </div>
            <p className="text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Location: {resource.location}
            </p>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Resource</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <input 
                type="text" placeholder="Resource Name (e.g. Oxygen Tank)" 
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
              />
              <select 
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required
              >
                <option value="">Select Type</option>
                <option value="medical">Medical</option>
                <option value="food">Food</option>
                <option value="water">Water</option>
                <option value="shelter">Shelter</option>
                <option value="tools">Tools</option>
              </select>
              <div className="flex gap-4">
                <input 
                  type="number" placeholder="Quantity" 
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                  value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: +e.target.value})} required 
                />
                <input 
                  type="text" placeholder="Unit (e.g. Ltr, Kg)" 
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                  value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} required 
                />
              </div>
              <input 
                type="text" placeholder="Location" 
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required 
              />
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700 font-semibold transition-colors">Save Resource</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-700 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;