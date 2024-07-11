const personService = require('../service/personService');

// 전체 조회
async function getAllPersons(req, res) {
  try {
    const persons = await personService.findAllPersons();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// id 조회
async function getPersonById(req, res) {
  const id = req.params.id;
  try {
    const person = await personService.findPersonById(id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// id로 인격 이름 조회
async function getNameByID(req, res){
  const id = req.params.id;
  try {
    const name = await personService.findNameById(id);
    if (name) {
      res.json(name);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllPersons,
  getPersonById,
  getNameByID
};

