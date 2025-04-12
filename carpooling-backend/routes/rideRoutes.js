const express = require('express');
const router = express.Router();
const { createRide, searchRides, requestToJoinRide, approveRider, getProfile, getMyRides, handleRequest } = require('../controllers/rideController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, createRide);
router.get('/search', auth, searchRides);
router.post('/:rideId/request', auth, requestToJoinRide);
router.post('/:rideId/approve', auth, approveRider);

router.post('/handleRequest', handleRequest);

router.get('/myrides', auth, getMyRides);
  

module.exports = router;




// // ------------------------ server/server.js ------------------------
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import rideRoutes from './routes/rideRoutes.js';
// import userRoutes from './routes/userRoutes.js';

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/rides', rideRoutes);
// app.use('/api/users', userRoutes);

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
//   .catch(err => console.error(err));

// // ------------------------ server/models/User.js ------------------------
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   phone: String
// });

// export default mongoose.model('User', userSchema);

// // ------------------------ server/models/Ride.js ------------------------
// import mongoose from 'mongoose';

// const rideSchema = new mongoose.Schema({
//   driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   pickupLocation: String,
//   dropLocation: String,
//   date: String,
//   time: String,
//   availableSeats: Number,
//   vehicleDetails: {
//     model: String,
//     plate: String
//   },
//   preferences: {
//     music: Boolean,
//     smoking: Boolean,
//     pets: Boolean
//   },
//   joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   approvedRiders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
// });

// export default mongoose.model('Ride', rideSchema);

// // ------------------------ server/controllers/userController.js ------------------------
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// export const signup = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email, password });
//   if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//   res.json({ token });
// };

// // ------------------------ server/controllers/rideController.js ------------------------
// import Ride from '../models/Ride.js';

// export const createRide = async (req, res) => {
//   const newRide = new Ride({ ...req.body, driverId: req.userId });
//   try {
//     const ride = await newRide.save();
//     res.status(201).json(ride);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const getRides = async (req, res) => {
//   try {
//     const rides = await Ride.find();
//     res.json(rides);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const requestToJoinRide = async (req, res) => {
//   try {
//     const ride = await Ride.findById(req.params.rideId);
//     if (!ride.joinRequests.includes(req.userId)) ride.joinRequests.push(req.userId);
//     await ride.save();
//     res.json(ride);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const approveJoinRequest = async (req, res) => {
//   try {
//     const ride = await Ride.findById(req.params.rideId);
//     ride.approvedRiders.push(req.params.riderId);
//     ride.joinRequests = ride.joinRequests.filter(id => id.toString() !== req.params.riderId);
//     await ride.save();
//     res.json(ride);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ------------------------ server/routes/userRoutes.js ------------------------
// import express from 'express';
// import { signup, login } from '../controllers/userController.js';

// const router = express.Router();

// router.post('/signup', signup);
// router.post('/login', login);

// export default router;

// // ------------------------ server/routes/rideRoutes.js ------------------------
// import express from 'express';
// import { createRide, getRides, requestToJoinRide, approveJoinRequest } from '../controllers/rideController.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// router.post('/create', auth, createRide);
// router.get('/search', getRides);
// router.post('/request/:rideId', auth, requestToJoinRide);
// router.post('/approve/:rideId/:riderId', auth, approveJoinRequest);

// export default router;

// // ------------------------ server/middleware/auth.js ------------------------
// import jwt from 'jsonwebtoken';

// const auth = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) return res.status(401).json({ error: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// export default auth;









// ------------------------ client/src/App.js ------------------------
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import RideList from './pages/RideList';
// import CreateRide from './pages/CreateRide';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import RideRequests from './pages/RideRequests';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<RideList />} />
//         <Route path="/create" element={<CreateRide />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/requests" element={<RideRequests />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// // ------------------------ client/src/pages/CreateRide.js ------------------------
// import { useState } from 'react';
// import axios from 'axios';

// function CreateRide() {
//   const [form, setForm] = useState({
//     pickupLocation: '',
//     dropLocation: '',
//     date: '',
//     time: '',
//     availableSeats: 1,
//     vehicleDetails: { model: '', plate: '' },
//     preferences: { music: false, smoking: false, pets: false }
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name in form.preferences) {
//       setForm({ ...form, preferences: { ...form.preferences, [name]: checked } });
//     } else if (name in form.vehicleDetails) {
//       setForm({ ...form, vehicleDetails: { ...form.vehicleDetails, [name]: value } });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post('/api/rides/create', form, {
//       headers: { Authorization: localStorage.getItem('token') },
//     });
//     alert('Ride Created');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="pickupLocation" placeholder="Pickup Location" onChange={handleChange} />
//       <input name="dropLocation" placeholder="Drop Location" onChange={handleChange} />
//       <input name="date" type="date" onChange={handleChange} />
//       <input name="time" type="time" onChange={handleChange} />
//       <input name="availableSeats" type="number" onChange={handleChange} />
//       <input name="model" placeholder="Car Model" onChange={handleChange} />
//       <input name="plate" placeholder="License Plate" onChange={handleChange} />
//       <label><input type="checkbox" name="music" onChange={handleChange} /> Music</label>
//       <label><input type="checkbox" name="smoking" onChange={handleChange} /> Smoking</label>
//       <label><input type="checkbox" name="pets" onChange={handleChange} /> Pets</label>
//       <button type="submit">Create Ride</button>
//     </form>
//   );
// }

// export default CreateRide;

// // ------------------------ client/src/pages/RideList.js ------------------------
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function RideList() {
//   const [rides, setRides] = useState([]);

//   useEffect(() => {
//     const fetchRides = async () => {
//       const res = await axios.get('/api/rides/search');
//       setRides(res.data);
//     };
//     fetchRides();
//   }, []);

//   const handleJoin = async (rideId) => {
//     await axios.post(`/api/rides/request/${rideId}`, {}, {
//       headers: { Authorization: localStorage.getItem('token') },
//     });
//     alert('Join request sent');
//   };

//   return (
//     <div>
//       <h2>Available Rides</h2>
//       {rides.map(ride => (
//         <div key={ride._id}>
//           <p>{ride.pickupLocation} → {ride.dropLocation}</p>
//           <p>{ride.date} at {ride.time}</p>
//           <button onClick={() => handleJoin(ride._id)}>Request to Join</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default RideList;

// // ------------------------ client/src/pages/RideRequests.js ------------------------
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function RideRequests() {
//   const [rides, setRides] = useState([]);

//   useEffect(() => {
//     const fetchRides = async () => {
//       const res = await axios.get('/api/rides/search', {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       setRides(res.data.filter(ride => ride.joinRequests.length > 0));
//     };
//     fetchRides();
//   }, []);

//   const approveRequest = async (rideId, riderId) => {
//     await axios.post(`/api/rides/approve/${rideId}/${riderId}`, {}, {
//       headers: { Authorization: localStorage.getItem('token') },
//     });
//     alert('Rider Approved');
//   };

//   return (
//     <div>
//       <h2>Join Requests</h2>
//       {rides.map(ride => (
//         <div key={ride._id}>
//           <h3>{ride.pickupLocation} → {ride.dropLocation}</h3>
//           {ride.joinRequests.map(rid => (
//             <div key={rid}>
//               <p>Request by: {rid}</p>
//               <button onClick={() => approveRequest(ride._id, rid)}>Approve</button>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default RideRequests;

