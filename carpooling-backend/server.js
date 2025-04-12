const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const cors = require('cors');
const morgan = require('morgan');

// dotenv.config();
require('dotenv').config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',  authRoutes);
app.use('/api/rides', rideRoutes);

app.get('/', (req, res) => res.send('Carpooling API Running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
