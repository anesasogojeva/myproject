const Product = require('../models/mysql/Product');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();  //findAll() → SELECT * FROM products.Sends the list back as JSON to frontend.
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};  

// Get one product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id); //findByPk() = find by primary key (usually id).req.params.id comes from the URL:
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);//create() inserts a new row into the database. req.body is the JSON sent by frontend (name, price, etc.)
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.destroy();
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
