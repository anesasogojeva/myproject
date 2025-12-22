const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");
const User = require("./User");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dietitianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Note.belongsTo(User, { foreignKey: "clientId", as: "client" });
Note.belongsTo(User, { foreignKey: "dietitianId", as: "dietitian" });

module.exports = { Note };
