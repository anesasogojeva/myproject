const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createCheckoutSession,
} = require("../controllers/paymentController");

router.post("/create-checkout-session", auth, createCheckoutSession);

// Note: POST /api/payment/stripe (the webhook) is registered directly in
// app.js, before the global express.json() middleware, since it needs the
// raw request body to verify Stripe's signature.

module.exports = router;
