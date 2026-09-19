const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const SavedPlan = sequelize.define('SavedPlan', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    planData: { type: DataTypes.JSON, allowNull: false },
}, {
    tableName: 'saved_plans',
    timestamps: true
});

module.exports = SavedPlan;
