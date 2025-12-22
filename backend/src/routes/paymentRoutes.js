const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createCheckoutSession,
  handleStripeWebhook
} = require("../controllers/paymentController");

router.post("/create-checkout-session", auth, createCheckoutSession);

// Webhook MUST use raw body
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
