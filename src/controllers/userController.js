const userService = require('../service/userService');

async function createUser(req, res) {
  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).json({ error: 'Nickname is required' });
  }

  try {
    const newUser = await userService.createUser(nickname);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createUser,
};
