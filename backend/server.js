const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/events',   require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/', (req, res) => res.send('EventHub API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));