const express = require('express');
const router = express.Router();
const {createNick} = require('../controllers/userController');

// 닉네임 생성하기 
router.post('/api/v1/nicknames', createNick);


module.exports = router;