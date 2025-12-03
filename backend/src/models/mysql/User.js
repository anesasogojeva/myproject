const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const User = sequelize.define('User',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role :{
        type: DataTypes.ENUM('admin','user','dietitian'),
        allowNull:false,
        defaultValue:'user'
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull:true
    },resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    timestamps: true
});

module.exports=User;