const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'carts',
    timestamps: true
});

module.exports = Cart;
