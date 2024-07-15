const { UserSelection, Person, sequelize } = require('../models');

async function createSelection(userId, personId) {
  const transaction = await sequelize.transaction();
  try {
    const userSelection = await UserSelection.create({ user_id: userId, person_id: personId }, { transaction });
    
    // 해당 person의 count 증가
    const person = await Person.findByPk(personId, { transaction });
    if (person) {
      person.count += 1;
      await person.save({ transaction });
    }

    await transaction.commit();
    return userSelection;
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating user selection:', error);
    throw error;
  }
}

module.exports = {
  createSelection
};
