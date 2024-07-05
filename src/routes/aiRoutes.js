const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const aiController = new AIController(); // 인스턴스 생성


// 대화 생성
router.post('/chat', (req, res) => aiController.chat(req, res));

// 대화 초기화
router.post('/reset', (req, res) => aiController.resetChat(req, res));

// 대화 요약
router.post('/summarize', (req, res) => aiController.summarize(req, res));

// tts
router.post('/tts', (req, res) => aiController.tts(req, res));

module.exports = router;
