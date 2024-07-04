const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 대화 생성
router.post('/chat', aiController.chat);

// // 대화 요약
// router.post('/summarize', aiController.summarize);

//tts

module.exports = router;
