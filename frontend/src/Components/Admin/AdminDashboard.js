import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 mt-14">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 mt-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h2>
        <p className="text-center mb-6">Manage the system here</p>
        
        <div className="space-y-4">
          <Link 
            to="users"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Manage Users
          </Link>
          
          <Link 
            to="books"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Manage Books
          </Link>
          
          <Link 
            to="reports"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            View Reports
          </Link>
          
          <Link 
            to="settings"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            System Settings
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
}
