const { User, RefreshToken } = require('../models');
const crypto = require('crypto');

// 비밀번호 해시 함수
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 비밀번호 검증 함수
function verifyPassword(password, hashedPassword) {
  const hashedInputPassword = hashPassword(password);
  return hashedInputPassword === hashedPassword;
}

async function createUser(userData) {
  try {
    userData.password = hashPassword(userData.password);
    return await User.create(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

async function isEmailTaken(email) {
  try {
    const user = await User.findOne({ where: { email } });
    return !!user; // 유저가 존재하면 true 반환, 아니면 false 반환
  } catch (error) {
    console.error('Error checking if email is taken:', error);
    throw error;
  }
}

async function findUserById(id) {
  try {
    return await User.findByPk(id);
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

async function findNicknameById(id) {
  try {
    const user = await User.findByPk(id);
    return user.nickname;
  } catch (error) {
    console.error('Error finding nickname by ID:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  isEmailTaken,
  findUserById,
  verifyPassword,
  findNicknameById
};
