import React from 'react';
import { AlertTriangle, Building2, Package, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
          Crisis Management System
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Centralized coordination for emergency medical services, resources, and volunteer efforts.
        </p>
      </div>
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link 
          to="/hospitals" 
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 transition-all active:scale-95 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-500/10 rounded-lg mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Hospitals</h2>
            <p className="text-gray-400 text-sm">Find and book hospital beds in real-time</p>
          </div>
        </Link>

        <Link 
          to="/resources" 
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 border border-gray-700 hover:border-green-500/50 transition-all active:scale-95 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-500/10 rounded-lg mb-4 group-hover:bg-green-500/20 transition-colors">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Resources</h2>
            <p className="text-gray-400 text-sm">Check availability of medical supplies</p>
          </div>
        </Link>

        <Link 
          to="/volunteers" 
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 border border-gray-700 hover:border-purple-500/50 transition-all active:scale-95 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-purple-500/10 rounded-lg mb-4 group-hover:bg-purple-500/20 transition-colors">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Volunteer</h2>
            <p className="text-gray-400 text-sm">Join our network of frontline responders</p>
          </div>
        </Link>

        <Link 
          to="/alerts" 
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 border border-gray-700 hover:border-red-500/50 transition-all active:scale-95 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-500/10 rounded-lg mb-4 group-hover:bg-red-500/20 transition-colors">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Alerts</h2>
            <p className="text-gray-400 text-sm">Stay updated with critical emergency broadcasts</p>
          </div>
        </Link>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 sm:mt-24 p-8 sm:p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-3xl border border-blue-500/20 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Want to make a difference?</h3>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Help us strengthen the community response by providing resources or your time.
        </p>
        <Link 
          to="/register" 
          className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 group"
        >
          Join the Network
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default Home;