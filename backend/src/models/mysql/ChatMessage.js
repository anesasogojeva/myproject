const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql"); // adjust if your config path is different

const ChatMessage = sequelize.define("ChatMessage", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderRole: {
    type: DataTypes.STRING,
    allowNull: false, // "user" or "dietician"
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  seen: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
},
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ChatMessage;
