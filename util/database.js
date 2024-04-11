const { Sequelize } = require("sequelize");
const sequelize = new Sequelize('node-complete', 'root', 'QWE1597538246qwe',
    {
        host: 'localhost',
        dialect: 'mysql',
    });

module.exports = sequelize;