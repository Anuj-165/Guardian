import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
            placeholder="Create a password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-blue-400 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;