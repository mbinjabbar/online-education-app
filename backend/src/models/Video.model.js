import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Subject from "./Subject.model.js";

const Video = sequelize.define("Video", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bannerUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

Video.belongsTo(Subject, { foreignKey: "subjectId", onDelete: "CASCADE" });
Subject.hasMany(Video, { foreignKey: "subjectId", onDelete: "CASCADE" });

export default Video;