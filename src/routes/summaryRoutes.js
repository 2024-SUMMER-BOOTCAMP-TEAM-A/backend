const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// 요약 및 저장
router.post('/createSummary', summaryController.createsaveSummary);

// 일지 출력
router.get('/getSummary/:chatLogId', summaryController.getSummary);

// 이미지 업로드 서명 URL 생성
router.get('/getUpload', summaryController.getUploadUrl.bind(summaryController));

module.exports = router;