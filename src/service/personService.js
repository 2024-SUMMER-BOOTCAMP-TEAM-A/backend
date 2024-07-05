const { Person } = require('../models');

// 전체 조회
async function findAllPersons() {
  const persons = await Person.findAll({
    attributes: ['id', 'name']
  });
  return persons;
}

// 부분 조회
async function findPersonById(id) {
  const person = await Person.findOne({
    where: { id: id },
    attributes: ['name', 'content']
  });
  return person;
}

module.exports = {
  findAllPersons,
  findPersonById
};
