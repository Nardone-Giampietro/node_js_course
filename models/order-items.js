const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
    }
});

module.exports = OrderItem;