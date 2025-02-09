import React, { useState } from "react";
import { Link } from "react-router-dom";
import InstallButton from "./InstallButton.jsx";
import FFImage from '../assets/FF.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar for all screen sizes */}
      <nav className="bg-black text-white w-full h-20 z-50 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}
          <img src={FFImage} alt="Logo" className="w-24 h-24" />

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}  // Toggle the menu on click
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Links for Desktop (hidden on mobile) */}
          <div className="hidden md:flex space-x-6">
          <Link
            to="/employee"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Employee Management
          </Link>

          <Link
            to="/expense"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Expense Management
          </Link>

          <Link
            to="/"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Home
          </Link>
            <InstallButton />
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation - Only visible on mobile screens */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-black to-red-600 text-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}  // Hide on medium and larger screens
      >
        <div className="flex items-center justify-between px-4 h-16">
          {/* Sidebar Logo */}
          <img src="/src/assets/FF.png" alt="Logo" className="w-24 h-24" />

          {/* Close Button */}
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Sidebar Navigation Links */}
          <Link
            to="/attendance"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Attendance
          </Link>

          <Link
            to="/payment"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)} 
          >
            Payment (employee)
          </Link>

          <Link
            to="/status"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Status (employee)
          </Link>

          <Link
            to="/"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Home
          </Link>

          <Link
            to="/employee"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)} 
          >
            Employee Management
          </Link>

          <Link
            to="/expense"
            className="block text-white text-lg py-2 hover:bg-gray-700 px-4 rounded"
            onClick={() => setIsMenuOpen(false)}  
          >
            Expense Management
          </Link>

          {/* InstallButton Component (keep as it is) */}
          <InstallButton />
        </div>
      </div>

      {/* Backdrop for Sidebar (when open) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;

