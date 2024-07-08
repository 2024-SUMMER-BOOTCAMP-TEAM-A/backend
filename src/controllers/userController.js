const jwt = require('jsonwebtoken');
const userService = require('../service/userService');
const crypto = require('crypto');

// 비밀번호 해시 함수
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function signup(req, res) {
  const { email, password, nickname } = req.body;
  try {
    // 이메일 중복 체크
    const isEmailTaken = await userService.isEmailTaken(email);
    if (isEmailTaken) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    const user = await userService.createUser({ email, password, nickname });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  signup,
  login
};
