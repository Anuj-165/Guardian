import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, X, Filter, MapPin, Box } from 'lucide-react';
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

  if (loading) return <div className="flex justify-center items-center min-h-[400px] text-white">Loading Resources...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-white">
      
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Available Resources</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-green-900/20 font-semibold"
          >
            <Plus size={20} className="mr-2" /> Add Resource
          </button>
          
          <div className="flex items-center bg-gray-800 rounded-xl px-3 border border-gray-700 focus-within:border-blue-500 transition-all">
            <Filter size={18} className="text-gray-500 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-white py-2.5 outline-none w-full text-sm font-medium cursor-pointer"
            >
              {getResourceTypes().map((type) => (
                <option key={type} value={type} className="bg-gray-800">
                  {type === 'all' ? 'All Categories' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 sm:p-6 hover:border-blue-500/40 transition-all group shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <Box size={16} className="text-blue-400" />
                  <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                    {resource.name}
                  </h2>
                </div>
                <span className="inline-block bg-blue-900/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-md border border-blue-800/50 uppercase font-bold tracking-wider">
                  {resource.type}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-green-400 block leading-none">{resource.quantity}</span>
                <span className="text-gray-500 text-[10px] uppercase font-bold">{resource.unit}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-gray-400 text-sm flex items-start">
                <MapPin size={16} className="mr-2 mt-0.5 shrink-0 text-gray-500" />
                <span className="font-medium">{resource.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No resources found in this category.
        </div>
      )}

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Resource</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Name</label>
                <input 
                  type="text" placeholder="e.g. Oxygen Tank" 
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
                <select 
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all"
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required
                >
                  <option value="">Select Category</option>
                  <option value="medical">Medical</option>
                  <option value="food">Food</option>
                  <option value="water">Water</option>
                  <option value="shelter">Shelter</option>
                  <option value="tools">Tools</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quantity</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all"
                    value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: +e.target.value})} required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Unit</label>
                  <input 
                    type="text" placeholder="Ltr, Kg, etc" 
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all"
                    value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Storage Location</label>
                <input 
                  type="text" placeholder="e.g. Warehouse A" 
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition-all"
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required 
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
                <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 order-1 sm:order-2">
                  Save Resource
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all order-2 sm:order-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;