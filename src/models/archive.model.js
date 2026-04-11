const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Archive = sequelize.define(
    "Archive",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      news_article_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["user_id", "news_article_id"],
        },
      ],
    }
  );

  return Archive;
};