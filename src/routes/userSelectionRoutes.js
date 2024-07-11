const express = require('express');
const router = express.Router();
const userSelectionController = require('../controllers/userSelectionController');

// 유저-인격 선택 저장
router.post('/', userSelectionController.saveUserSelection);
router.post('/chatLogs', userSelectionController.createChatLog);

module.exports = router;
