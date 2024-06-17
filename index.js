const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.js');
const cors = require('cors')
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

const app = express();


// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']; // Add any additional origins as needed
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,

}));


// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(uri)
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);


// Authentication Route
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication logic
  if (username === 'testuser@gmail.com' && password === 'testpassword') {
    res.json({ success: true, message: 'Login successful', token: 'dummy-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));