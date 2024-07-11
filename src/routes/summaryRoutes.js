const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// 요약 및 저장
router.post('/createSummary', summaryController.createsaveSummary);

// 요약본 출력
router.get('/getSummary/:chatLogId', summaryController.getSummary);

// 이미지 생성 및 업로드
router.post('/generate-image', summaryController.generateAndUploadImage);

// 상담 일지 생성
router.get('/summarize/creatLog', summaryController.createLog);

module.exports = router;
