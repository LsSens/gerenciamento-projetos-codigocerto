const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Projeto = sequelize.define('Projeto', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = Projeto;
