import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const backend_url = 'http://localhost:4000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${backend_url}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
        else toast.error(data.message);
      } catch (err) {
        toast.error('Failed to fetch user profile');
      }
    };

    const fetchUserRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${backend_url}/api/rides/myrides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setRides(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
    fetchUserRides();
  }, []);

  const handleDecision = async (rideId, requestUserId, decision) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backend_url}/api/rides/handleRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId, requestId: requestUserId, decision }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success('Request updated');
        // Refresh data
        const updatedRes = await fetch(`${backend_url}/api/rides/myrides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedData = await updatedRes.json();
        if (updatedRes.ok) setRides(updatedData);
      } else {
        toast.error(data.message || 'Failed to update request');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {user && (
        <div className="mb-6">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">Your Rides</h3>
      {rides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul className="space-y-4">
          {rides.map((ride) => (
            <li key={ride._id} className="border p-4 rounded">
              <p><strong>From:</strong> {ride.pickupLocation}</p>
              <p><strong>To:</strong> {ride.dropLocation}</p>
              <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>

              {ride.role === 'driver' ? (
                <>
                  <p className="mt-2 font-semibold text-indigo-600">You are the Driver</p>
                  {ride.joinRequests.length === 0 ? (
                    <p className="text-gray-600">No join requests yet.</p>
                  ) : (
                    <div className="mt-3">
                      <p className="font-semibold">Join Requests:</p>
                      <ul className="space-y-2 mt-2">
                        {ride.joinRequests.map((user) => {
                          const isApproved = ride.approvedRiders.some(
                            (r) => r._id === user._id
                          );
                          return (
                            <li key={user._id} className="border p-2 rounded">
                              <p><strong>User:</strong> {user.name} ({user.email})</p>
                              <p><strong>Status:</strong> {isApproved ? 'Approved' : 'Pending'}</p>
                              {!isApproved && (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleDecision(ride._id, user._id, 'approved')}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleDecision(ride._id, user._id, 'rejected')}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 font-semibold text-indigo-600">You are a Rider</p>
                  {ride.approvedRiders.some((r) => r._id === user._id) ? (
                    <p className="text-green-600">Your request has been Approved</p>
                  ) : (
                    <p className="text-yellow-600">Your request is Pending</p>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
