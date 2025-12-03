const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); //lets React talk to your Node API
app.use(express.json()); //allows your API to read JSON bodies

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;

//This file creates the Express app.
//Its job: Import Express,Add middleware (JSON, CORS…),Load routing files