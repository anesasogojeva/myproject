const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import models
const Cart = require("../models/mysql/Cart");
const CartItem = require("../models/mysql/CartItem");
const Product = require("../models/mysql/Product"); 
const Order = require("../models/mysql/Order");
const OrderItem = require("../models/mysql/OrderItem");

// Apply auth
router.post("/create-cod-order", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Product] }], // now Product is defined
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let subtotal = 0;
    for (const item of cart.CartItems) {
      subtotal += item.quantity * item.Product.price;
    }
    const shippingCost = 5;
    const total = subtotal + shippingCost;

    // Create order
    const newOrder = await Order.create({
      userId,
      total,
      status: "pending_payment",
      paymentMethod: "cash",
      shippingAddress: req.body.address,
    });

    // Create order items
    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ message: "COD order created successfully", orderId: newOrder.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
