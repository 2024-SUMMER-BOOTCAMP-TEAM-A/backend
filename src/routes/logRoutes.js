const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// 채팅 로그 요약 생성 및 저장
router.post('/create-summary', logController.createSummary);

// 요약본을 출력
router.get('/summary/:chatLogId', logController.getSummary);

module.exports = router;