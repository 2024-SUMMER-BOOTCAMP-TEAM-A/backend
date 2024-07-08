const { User } = require('../models');
const crypto = require('crypto');

// 비밀번호 해시 함수
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createUser(userData) {
  userData.password = hashPassword(userData.password);
  return await User.create(userData);
}

async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function isEmailTaken(email) {
  const user = await User.findOne({ where: { email } });
  return !!user; // 유저가 존재하면 true 반환, 아니면 false 반환
}

module.exports = {
  createUser,
  findUserByEmail,
  isEmailTaken
};
