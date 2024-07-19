'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('userSelection', 'userSelection_user_id_person_id_unique');
    // 다른 마이그레이션 작업을 추가할 수 있습니다.
  },

  down: async (queryInterface, Sequelize) => {
    // 다운 마이그레이션: 인덱스를 다시 추가할 경우
    await queryInterface.addIndex('userSelection', ['user_id', 'person_id'], {
      unique: true,
      name: 'userSelection_user_id_person_id_unique'
    });
  }
};
