const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
})

module.exports = Order;