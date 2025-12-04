const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require("../middleware/authMiddleware");

router.post('/add',auth, cartController.addToCart);
router.get('/',auth, cartController.getCart);
router.delete('/:id', auth,cartController.removeItem);

module.exports = router;
