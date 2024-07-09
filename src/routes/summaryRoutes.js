const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// 요약 생성 및 저장
router.post('/createSummary', summaryController.createSummary);

// 요약본 출력
router.get('/getSummary/:chatLogId', summaryController.getSummary);

// 대화 요약
router.post('/summarize', summaryController.summarize);

// 이미지 생성 및 업로드
router.post('/generate-image', summaryController.generateAndUploadImage);

module.exports = router;
