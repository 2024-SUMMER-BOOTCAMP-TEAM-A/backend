const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// 요약 및 저장
router.post('/createSummary', summaryController.createsaveSummary);

// 일지 출력
router.get('/getSummary/:chatLogId', summaryController.getSummary);

module.exports = router;