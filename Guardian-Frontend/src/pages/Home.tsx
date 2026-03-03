import React from 'react';
import { AlertTriangle, Guitar as Hospital, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Crisis Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/hospitals" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center">
            <Hospital className="w-12 h-12 mb-4 text-blue-400" />
            <h2 className="text-xl font-semibold mb-2">Hospitals</h2>
            <p className="text-gray-400 text-center">Find and book hospital beds</p>
          </div>
        </Link>

        <Link to="/resources" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center">
            <Package className="w-12 h-12 mb-4 text-green-400" />
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <p className="text-gray-400 text-center">Check availability of medical supplies</p>
          </div>
        </Link>

        <Link to="/volunteers" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-4 text-purple-400" />
            <h2 className="text-xl font-semibold mb-2">Volunteer</h2>
            <p className="text-gray-400 text-center">Join our volunteer network</p>
          </div>
        </Link>

        <Link to="/alerts" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-2">Alerts</h2>
            <p className="text-gray-400 text-center">Stay updated with crisis alerts</p>
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl text-gray-300 mb-4">Ready to help?</p>
        <Link 
          to="/register" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Home;