import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SearchRide = () => {
  const [filters, setFilters] = useState({ pickup: '', drop: '', femaleOnly: false, noSmoking: false });
  const [rides, setRides] = useState([]);

  const backend_url = 'http://localhost:4000';
  
  const requestToJoinRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backend_url}/api/rides/${rideId}/request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        toast.success('Request sent to driver');
      } else {
        toast.error(data.message || 'Failed to send request');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  const searchRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const query = `pickup=${filters.pickup}&drop=${filters.drop}`;
      const res = await fetch(`${backend_url}/api/rides/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRides(data);
        if (!data.length) toast('No rides found');
      } else {
        toast.error('Search failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Find a Ride</h2>
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input type="text" name="pickup" placeholder="Pickup Location" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input type="text" name="drop" placeholder="Drop Location" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="femaleOnly" onChange={handleChange} /> Female Only
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="noSmoking" onChange={handleChange} /> No Smoking
          </label>
        </div>
        <button onClick={searchRides} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
          Search Rides
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {rides.map((ride) => (
          <div key={ride._id} className="bg-white shadow p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{ride.pickupLocation} ➡ {ride.dropLocation}</h3>
                <p className="text-sm text-gray-500">{new Date(ride.departureTime).toLocaleString()}</p>
                <p className="text-sm">Seats: {ride.availableSeats} | Vehicle: {ride.vehicleDetails.model}</p>
                <p className="text-sm">Preferences: {ride.preferences.music ? 'Music' : ''} {ride.preferences.smoking ? 'Smoking' : ''} {ride.preferences.pets ? 'Pets' : ''}</p>
              </div>
              <div className="text-right">
                <span className="text-indigo-600 font-bold">Match: {ride.matchPercentage || 0}%</span>
                <button
  onClick={() => requestToJoinRide(ride._id)}
  className="ml-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
>
  Request
</button>
             
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRide;