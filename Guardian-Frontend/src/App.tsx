import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import Resources from './pages/Resources';
import Volunteers from './pages/Volunteers';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App