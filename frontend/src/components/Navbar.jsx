import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setIsLoggedIn(false);             // Update state
    navigate('/login');               // Redirect to login page
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        CarpoolEase
      </Link>
      <div className="flex flex-wrap gap-4 items-center">
        <Link to="/" className="hover:text-indigo-600 font-medium">Home</Link>
        <Link to="/search" className="hover:text-indigo-600 font-medium">Find Rides</Link>
        <Link to="/create" className="hover:text-indigo-600 font-medium">Offer Ride</Link>
        <Link to="/dashboard" className="hover:text-indigo-600 font-medium">Dashboard</Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login"  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
               Login
            </Link>
            <Link to="/register" className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
