'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      // define association here
    }
  }
  Person.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false // 필수 항목으로 설정
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Person',
    tableName: 'person',
    timestamps: false,
    underscored: true
  });
  return Person;
};
