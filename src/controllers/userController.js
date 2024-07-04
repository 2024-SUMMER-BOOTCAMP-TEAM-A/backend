const User = require('../models/user');

//닉네임 생성 함수 만들기 
async function createNick(req, res) {
    const { nickname } = req.body;
  
    try {
      // 닉네임 생성 및 저장
      const newUser = await User.create({ nickname });
  
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(422).json({ error: 'Error creating user' });
    }
  }
  
  module.exports = {
    createNick
  };