import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Building2 as Hospital, 
  Package, 
  Users, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  
  const NavLink = ({ to, icon: Icon, children, onClick }: any) => (
    <Link
      to={to}
      onClick={() => {
        setIsOpen(false);
        if (onClick) onClick();
      }}
      className="flex items-center px-4 py-3 md:py-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all font-medium"
    >
      <Icon className="w-5 h-5 mr-3 md:mr-2 text-blue-400" />
      {children}
    </Link>
  );

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">Guardian</span>
          </Link>

          
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/hospitals" icon={Hospital}>Hospitals</NavLink>
            <NavLink to="/resources" icon={Package}>Resources</NavLink>
            <NavLink to="/volunteers" icon={Users}>Volunteer</NavLink>
            <NavLink to="/alerts" icon={AlertTriangle}>Alerts</NavLink>

            <div className="h-6 w-px bg-gray-700 mx-2" />

            {user ? (
              <>
                {user.email === 'admin@example.com' && (
                  <NavLink to="/admin" icon={Bell}>Admin</NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
              >
                Login
              </Link>
            )}
          </div>

          
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-gray-900 border-b border-gray-800 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          <NavLink to="/hospitals" icon={Hospital}>Hospitals</NavLink>
          <NavLink to="/resources" icon={Package}>Resources</NavLink>
          <NavLink to="/volunteers" icon={Users}>Volunteer</NavLink>
          <NavLink to="/alerts" icon={AlertTriangle}>Alerts</NavLink>
          
          <div className="my-4 border-t border-gray-800" />
          
          {user ? (
            <>
              {user.email === 'admin@example.com' && (
                <NavLink to="/admin" icon={Bell}>Admin Panel</NavLink>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout Account
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;