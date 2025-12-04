const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/checkout', auth, orderController.checkout);
router.get('/my-orders', auth, orderController.getMyOrders);

// This must come before '/:id'
router.get('/user/:userId', auth, orderController.getOrdersByUser);

router.get('/:id', auth, orderController.getOrderById);
router.delete('/:id', auth, orderController.cancelOrder);

// Keep getAllOrders last
router.get('/', auth, orderController.getAllOrders);

module.exports = router;
