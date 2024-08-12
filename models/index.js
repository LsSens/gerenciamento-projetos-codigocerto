const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite' // arquivo onde o SQLite armazenará os dados
});

module.exports = sequelize;
