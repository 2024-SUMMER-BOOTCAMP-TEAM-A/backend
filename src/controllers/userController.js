const jwt = require('jsonwebtoken');
const userService = require('../service/userService');

// 사용자 생성 함수 (회원가입)
async function signup(req, res) {
  const { email, password, nickname } = req.body;
  try {
    // 이메일 중복 체크
    const isEmailTaken = await userService.isEmailTaken(email);
    if (isEmailTaken) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    const user = await userService.createUser({ email, password, nickname });
    console.log(`Hashed password for ${email}: ${user.password}`);
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 로그인 함수
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`Stored hashed password for ${email}: ${user.password}`);
    const isMatch = userService.verifyPassword(password, user.password);
    console.log(`Password match result for ${email}: ${isMatch}`);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: error.message });
  }
}


// 사용자 ID 반환 함수
async function getUserId(req) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findUserById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.id;
  } catch (error) {
    console.error('Error in getUserId:', error);
    throw error;
  }
}

// 사용자 닉네임 반환 함수
async function getNickname(req, res) {
  try {
    const nickname = await userService.findNicknameById(req);

    if (!nickname) {
      return res.status(404).json({ message: 'nickname not found' });
    }

    return nickname;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 리프레시 토큰으로 새로운 액세스 토큰 발급
async function refreshToken(req, res) {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await userService.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  signup,
  login,
  getUserId,
  getNickname,
  refreshToken
};
