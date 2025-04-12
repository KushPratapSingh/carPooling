import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center mt-24">
      <h1 className="text-5xl font-bold text-indigo-700 mb-4">Welcome to CarpoolEase</h1>
      <p className="text-xl text-gray-600 mb-8">Smart. Safe. Privacy-Focused Ride Sharing.</p>
      <Link to="/search" className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-indigo-700">
        Find a Ride
      </Link>
    </div>
  );
};

export default Home;
