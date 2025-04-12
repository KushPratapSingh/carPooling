import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CreateRide = () => {

  const backend_url = 'http://localhost:4000';

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    departureTime: '',
    availableSeats: 1,
    vehicleDetails: { model: '', licensePlate: '' },
    preferences: { music: false, smoking: false, pets: false },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.preferences) {
      setFormData({
        ...formData,
        preferences: { ...formData.preferences, [name]: checked },
      });
    } else if (name in formData.vehicleDetails) {
      setFormData({
        ...formData,
        vehicleDetails: { ...formData.vehicleDetails, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backend_url}/api/rides/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Ride created successfully');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to create ride');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Offer a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="pickupLocation" placeholder="Pickup Location" onChange={handleChange}
          className="w-full px-4 py-2 border rounded" required />
        <input type="text" name="dropLocation" placeholder="Drop Location" onChange={handleChange}
          className="w-full px-4 py-2 border rounded" required />
        <input type="datetime-local" name="departureTime" onChange={handleChange}
          className="w-full px-4 py-2 border rounded" required />
        <input type="number" name="availableSeats" min="1" placeholder="Available Seats" onChange={handleChange}
          className="w-full px-4 py-2 border rounded" required />

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold">Vehicle Details</h3>
          <input type="text" name="model" placeholder="Car Model" onChange={handleChange}
            className="w-full px-4 py-2 border rounded mt-2" required />
          <input type="text" name="licensePlate" placeholder="License Plate" onChange={handleChange}
            className="w-full px-4 py-2 border rounded mt-2" required />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="music" onChange={handleChange} /> Music Allowed
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="smoking" onChange={handleChange} /> Smoking Allowed
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="pets" onChange={handleChange} /> Pets Allowed
          </label>
        </div>

        <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
          Post Ride
        </button>
      </form>
    </div>
  );
};

export default CreateRide;
