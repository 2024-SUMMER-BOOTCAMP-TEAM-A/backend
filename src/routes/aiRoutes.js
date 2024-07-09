const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 대화 생성
router.post('/chat', aiController.chat);

// 대화 초기화
router.post('/reset', aiController.resetChat);

// TTS 생성
router.post('/tts', aiController.tts);

module.exports = router;
