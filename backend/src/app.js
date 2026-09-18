const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Stripe webhook needs the raw, unparsed request body to verify its
// signature - it must be registered before the global express.json()
// below, or that middleware consumes the body first and signature
// verification always fails.
app.post(
  "/api/payment/stripe",
  express.raw({ type: "application/json" }),
  require("./controllers/paymentController").handleStripeWebhook
);

// Middleware
app.use(express.json()); //allows your API to read JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/order',  require('./routes/orderRoutes'));
app.use("/api/contact", require("./routes/contactRoutes"));;
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/cod", require("./routes/codPaymentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/ai", require("./routes/aiRoutes"));


module.exports = app;

//This file creates the Express app.
//Its job: Import Express,Add middleware (JSON, CORS…),Load routing files