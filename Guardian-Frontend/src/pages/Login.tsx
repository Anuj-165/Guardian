import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import API from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await API.post('/auth/login', { email, password });
      
      // 3. Extract both user and token from the response
      const { user, token } = response.data;

      if (token && user) {
        
        login(user, token);
        
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        
        toast.error('Login failed: Missing user information');
        
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/register')}
          className="text-blue-400 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;