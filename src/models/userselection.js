'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserSelection extends Model {
    static associate(models) {
      UserSelection.belongsTo(models.User, { foreignKey: 'user_id' });
      UserSelection.belongsTo(models.Person, { foreignKey: 'person_id' });
    }
  }
  UserSelection.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
        key: 'id'
      }
    },
    selected_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'UserSelection',
    tableName: 'userSelection',
    timestamps: false,
    underscored: true
  });
  return UserSelection;
};
