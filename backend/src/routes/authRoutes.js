const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const controller = require('../controllers/authController');

router.post("/register",controller.register);
router.post("/login" , controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
// Protected route

router.post("/change-password", auth, controller.changePassword);
router.get("/profile", auth, (req, res) => {
    res.json({ message: "Profile", user: req.user });
});


// Admin-only route
router.get("/admin", auth, role("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Dietitian-only route
router.get("/dietitian", auth, role("dietitian"), (req, res) => {
    res.json({ message: "Welcome Dietitian" });
});

module.exports = router;