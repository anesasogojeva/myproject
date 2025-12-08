const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); //lets React talk to your Node API
app.use(express.json()); //allows your API to read JSON bodies

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/order',  require('./routes/orderRoutes'));
app.use("/api/contact", require("./routes/contactRoutes"));

module.exports = app;

//This file creates the Express app.
//Its job: Import Express,Add middleware (JSON, CORS…),Load routing files