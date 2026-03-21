import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to RMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Reseller Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          <div className="text-center font-medium text-gray-700 mb-6">
            Please select your role to continue
          </div>

          {/* ปุ่มสำหรับ Admin */}
          <Link 
            to="/login?role=admin" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            I am an Admin
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* ปุ่มสำหรับ Reseller */}
          <Link 
            to="/login?role=reseller" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
          >
            I am a Reseller
          </Link>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Want to start selling? </span>
            <Link to="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Register as Reseller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;