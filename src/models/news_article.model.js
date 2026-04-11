const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const NewsArticle = sequelize.define("NewsArticle", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    source_name: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    published_at: {
      type: DataTypes.DATE,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 🔥 important for deduplication
    },
    ai_summary: {
      type: DataTypes.TEXT,
    },
  });

  return NewsArticle;
};