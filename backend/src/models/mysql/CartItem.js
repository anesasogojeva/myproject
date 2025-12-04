const Product = require('./Product');
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');
const Cart = require('./Cart');

const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
    tableName: 'cart_items'
});

CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

module.exports = CartItem;
