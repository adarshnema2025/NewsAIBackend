const { Sequelize } = require("sequelize");

const dbConfig = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: "postgres",
  };

const sequelize = new Sequelize(dbConfig, {
  dialect: "postgres",
  logging: false,
  dialectOptions: process.env.DATABASE_URL
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
    : {},
});

module.exports = sequelize;


//This file creates the connection to your PostgreSQL database.
// database.js → creates DB connection
// index.js → loads models & relationships
// server.js → syncs DB & starts app
// controllers → use models for CRUD