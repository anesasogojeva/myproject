const User = require("../models/mysql/User");
const ChatMessage = require("../models/mysql/ChatMessage");
const { Note } = require("../models/mysql/Note");
const Cart = require("../models/mysql/Cart");
const CartItem = require("../models/mysql/CartItem");
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password", "refreshToken"] }
        });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password", "refreshToken"] }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update(req.body);

        res.json({ message: "User updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Clean up records tied to this account so nothing orphaned lingers
        // (e.g. showing up as "Unknown User" in the dietitian chat inbox).
        await ChatMessage.destroy({ where: { userId: user.id } });
        await Note.destroy({ where: { clientId: user.id } });

        const cart = await Cart.findOne({ where: { userId: user.id } });
        if (cart) {
            await CartItem.destroy({ where: { cartId: cart.id } });
            await cart.destroy();
        }

        await user.destroy();

        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create users" });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Allowed roles
    const allowedRoles = ["user", "admin", "dietitian"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Allowed roles: user, admin, dietitian",
      });
    }

    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

