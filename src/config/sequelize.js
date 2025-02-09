const { Sequelize } = require('sequelize');
require('dotenv').config(); // dotenv 패키지 로드
const config = require('./config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  timezone: dbConfig.timezone,
});

module.exports = sequelize;
