const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Page = sequelize.define(
    "Page",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // FK → notebooks.id
      notebook_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      // FK → news_articles.id
      news_article_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      notes: {
        type: DataTypes.TEXT,
      },

      order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,

      // 🔥 prevent same article being added twice in same notebook
      indexes: [
        {
          unique: true,
          fields: ["notebook_id", "news_article_id"],
        },
      ],
    }
  );

  return Page;
};