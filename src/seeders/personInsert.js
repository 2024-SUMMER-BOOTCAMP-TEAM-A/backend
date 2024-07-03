'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('person', [
      { id: 1, name: '장원영', content: '나는 장원영이다', count: 1, created_at: new Date(), updated_at: new Date() },
      { id: 2, name: '박명수', content: '나는 박명수이다', count: 2, created_at: new Date(), updated_at: new Date() },
      { id: 3, name: '김아영', content: '나는 김아영이다', count: 3, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('person', null, {});
  },
};
