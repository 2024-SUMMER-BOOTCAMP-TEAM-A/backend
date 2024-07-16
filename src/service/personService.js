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

// count 값 기준으로 내림차순 정렬하여 조회
async function findPersonsByCountDesc() {
  try {
    const persons = await Person.findAll({
      attributes: ['name', 'count'],
      order: [['count', 'DESC']]
    });
    return persons;
  } catch (error) {
    console.error('Error finding persons by count desc:', error);
    throw error;
  }
}

module.exports = {
  findAllPersons,
  findPersonById,
  findNameById,
  findPersonsByCountDesc
};