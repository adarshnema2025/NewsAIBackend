const sequelize = require("../config/database");

const User = require("./user.model")(sequelize);
const Notebook = require("./notebook.model")(sequelize);
const NewsArticle = require("./news_article.model")(sequelize);
const Page = require("./page.model")(sequelize);
const Archive = require("./archive.model")(sequelize);

// ================= Associations =================

// User ↔ Notebook
User.hasMany(Notebook, { foreignKey: "user_id", onDelete: "CASCADE" });
Notebook.belongsTo(User, { foreignKey: "user_id" });

// Notebook ↔ Page
Notebook.hasMany(Page, { foreignKey: "notebook_id", onDelete: "CASCADE" });
Page.belongsTo(Notebook, { foreignKey: "notebook_id" });

// NewsArticle ↔ Page
NewsArticle.hasMany(Page, { foreignKey: "news_article_id", onDelete: "CASCADE" });
Page.belongsTo(NewsArticle, { foreignKey: "news_article_id" });

// User ↔ Archive
User.hasMany(Archive, { foreignKey: "user_id", onDelete: "CASCADE" });
Archive.belongsTo(User, { foreignKey: "user_id" });

// NewsArticle ↔ Archive
NewsArticle.hasMany(Archive, { foreignKey: "news_article_id", onDelete: "CASCADE" });
Archive.belongsTo(NewsArticle, { foreignKey: "news_article_id" });

module.exports = {
  sequelize,
  User,
  Notebook,
  NewsArticle,
  Page,
  Archive,
};