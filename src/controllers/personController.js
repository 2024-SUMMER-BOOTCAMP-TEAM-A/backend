const personRepository = require('../repositories/personRepository');

// 전체 조회
async function getAllPersons(req, res) {
  try {
    const persons = await personRepository.findAllPersons();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// id 조회
async function getPersonById(req, res) {
  const id = req.params.id;
  try {
    const person = await personRepository.findPersonById(id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllPersons,
  getPersonById
};

