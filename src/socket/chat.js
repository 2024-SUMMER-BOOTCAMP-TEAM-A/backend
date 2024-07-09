const AIController = require('../controllers/aiController');
const express = require('express');
const app = express();
app.use(express.json());

const { defaultService: openAIDefaultService, luckyService, simonService, mzService, twentyQService, summaryService } = require('../models/openAiModel');
const { defaultService: clovaDefaultService, luckyService: clovaLuckyService, simonService: clovaSimonService, mzService: clovaMzService, twentyQService: clovaTwentyQService } = require('../models/clovaModel');


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', async (msg) => {
      console.log('message: ' + msg);

      try {
        // Express req, res 객체 모의
        const req = {
          body: { userMessage: msg }
        };
        console.log('gpt한테 보낼 메시지:', req.body);
        
        const res = {
          json: (data) => {
            // 클라이언트에게 AI 응답 전송
            io.emit('chat message', data.response);
            console.log('gpt 응답:', data.response);
          }
        };

        await aiController.chat(req, res);
      } catch (error) {
        console.error('Error handling chat message:', error);
        io.emit('chat message', `Error getting AI response: ${error.message}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
