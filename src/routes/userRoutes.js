const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup); // 회원가입
router.post('/login', userController.login); // 로그인
router.get('/nickname', userController.getUserId); // 아이디 조회
router.post('/refresh', userController.refreshToken); // 토큰 재발급

module.exports = router;
