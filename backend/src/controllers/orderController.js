const Order = require('../models/mysql/Order');
const OrderItem = require('../models/mysql/OrderItem');
const Cart = require('../models/mysql/Cart');
const CartItem = require('../models/mysql/CartItem');
const Product = require('../models/mysql/Product');


exports.checkout = async (req, res) => {
    const userId = req.user.id;


    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: [{ model: CartItem, include: [Product] }]
        });

        if (!cart || cart.CartItems.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        let total = 0;

        cart.CartItems.forEach(i => {
            total += i.quantity * i.Product.price;
        });

        const order = await Order.create({ userId, total });

        for (const item of cart.CartItems) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.Product.price
            });
        }

        await CartItem.destroy({ where: { cartId: cart.id } });

        res.status(201).json({ message: "Order created", orderId: order.id });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                include: [Product]
            }]
        });

        return res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};


exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItem,
                include: [Product]
            }]
        });

        return res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch your orders" });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        let userId;

        if (req.user.role === 'admin' && req.params.userId) {
            // Admin can specify userId
            userId = req.params.userId;
        } else {
            // Normal user gets their own orders
            userId = req.user.id;
        }

        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, include: [Product] }]
        });

        return res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [{
                model: OrderItem,
                include: [Product]
            }]
        });

        if (!order) return res.status(404).json({ message: "Order not found" });

        return res.status(200).json(order);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch order" });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await Order.findByPk(id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.userId !== userId)
            return res.status(403).json({ message: "Not your order" });

        await order.destroy();

        return res.status(200).json({ message: "Order canceled" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to cancel order" });
    }
};