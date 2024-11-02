import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Dashboard
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <p className="text-center mb-6">Welcome to the Admin Dashboard. You can manage the system here.</p>
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
            {/* Outlet for nested routes */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
