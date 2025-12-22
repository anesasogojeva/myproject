const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'   // pending, paid, shipped, canceled
    },
    
    paymentMethod: {
        type: DataTypes.STRING,  
        allowNull: true
    },
    shippingAddress: {
  type: DataTypes.STRING,
  allowNull: false,
}
    ,
stripePaymentIntentId: { type: DataTypes.STRING, allowNull: true },
stripeSessionId: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'orders',
    timestamps: true
});


module.exports = Order;
