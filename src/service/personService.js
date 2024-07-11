const { Person } = require('../models');

// 전체 조회
async function findAllPersons() {
  const persons = await Person.findAll({
    attributes: ['name', 'title']
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

// id로 이름 조회
async function findNameById(id) {
  const person = await Person.findOne({
    where: { id: id },
    attributes: ['name']
  });
  return person;
}

module.exports = {
  findAllPersons,
  findPersonById,
  findNameById
};
