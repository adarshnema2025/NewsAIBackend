const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true   // null for OAuth-only users
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }

    }, { timestamps: true }

    )
    return User;
}



