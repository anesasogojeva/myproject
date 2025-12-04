const Cart = require('../models/mysql/Cart');
const CartItem = require('../models/mysql/CartItem');
const Product = require('../models/mysql/Product');


exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product does not exist" });
        }

        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) cart = await Cart.create({ userId });

        
        let item = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity
            });
        }

        res.status(201).json(item);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price', 'image']
                        }
                    ]
                }
            ]
        });

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.removeItem = async (req, res) => {
    try {
        await CartItem.destroy({ where: { id: req.params.id } });
        res.json({ message: "Item removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};