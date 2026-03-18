import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Subject = sequelize.define("Subject", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bannerUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
  timestamps: false
})

export default Subject;