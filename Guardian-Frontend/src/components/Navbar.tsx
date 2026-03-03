import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Guitar as Hospital, Package, Users, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // from AuthContext
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">Guardian</Link>
          
          <div className="flex space-x-4">
            <Link to="/hospitals" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
              <Hospital className="w-5 h-5 mr-1" />
              Hospitals
            </Link>
            <Link to="/resources" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
              <Package className="w-5 h-5 mr-1" />
              Resources
            </Link>
            <Link to="/volunteers" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
              <Users className="w-5 h-5 mr-1" />
              Volunteer
            </Link>
            <Link to="/alerts" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
              <AlertTriangle className="w-5 h-5 mr-1" />
              Alerts
            </Link>

            {user ? (
              <>
                {user.email === 'admin@example.com' && (
                  <Link to="/admin" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
                    <Bell className="w-5 h-5 mr-1" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;