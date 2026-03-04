import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await API.post('/auth/register', { 
        name, 
        email, 
        password 
      });

      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-gray-800 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-700">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join our crisis management network today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;