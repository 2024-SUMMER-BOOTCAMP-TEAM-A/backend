const { User } = require('../models');

async function createUser(nickname) {
  try {
    const newUser = await User.create({ nickname });
    return newUser;
  } catch (error) {
    throw new Error('Error creating user');
  }
}

module.exports = {
  createUser,
};
