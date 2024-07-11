const { UserSelection } = require('../models');

async function createSelection(userId, personId) {
  try {
    const userSelection = new UserSelection({ user_id: userId, person_id: personId });
    await userSelection.save();
    return userSelection;
  } catch (error) {
    console.error('Error creating user selection:', error);
    throw error;
  }
}

module.exports = {
  createSelection
};
