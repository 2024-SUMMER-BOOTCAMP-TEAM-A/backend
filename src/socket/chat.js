const AIController = require('../controllers/aiController');
const userSelectionController = require('../controllers/userSelectionController');
const {ChatLog} = require('../models/chatLogModel'); // ChatLog 모델을 임포트합니다.

module.exports = (io, redisClient) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('start chat', async (data) => {
      const { token } = data;
      console.log('start chat event received:', data);

      try {
        const req = {
          header: () => `Bearer ${token}`
        };

        const res = {
          status: (code) => ({
            json: (data) => {
              if (code === 201 && data.chatLog) {
                socket.data.chatLogId = data.chatLog._id;
                socket.data.persona = data.chatLog.persona;
                socket.data.nickname = data.chatLog.userName;
              }
              socket.emit('chat log created', { code, data });
            }
          })
        };

        await userSelectionController.createChatLog(req, res);
      } catch (error) {
        console.error('Error handling start chat event:', error);
        socket.emit('error', { message: 'Error starting chat', error: error.message });
      }
    });

    socket.on('chat message', async (msg) => {
      console.log('message: ' + msg.content);

      try {
        const { nickname, persona } = socket.data;

        if (!nickname || !persona) {
          console.error('Nickname or persona not set for this socket.');
          return io.emit('chat message', 'Error: Nickname or persona not set.');
        }

        // 메시지를 Redis에 저장
        await redisClient.rPush(`chat:${socket.id}`, JSON.stringify({
          timestamp: new Date().toISOString(),
          sender: nickname,
          message: msg.content
        }));

        // Express req, res 객체 모의
        const reqAI = {
          body: { userMessage: msg.content }
        };
        console.log('gpt한테 보낼 메시지:', reqAI.body);

        const resAI = {
          json: async (data) => {
            // 클라이언트에게 AI 응답 전송
            const aiMessage = data.response;
            io.emit('chat message', { sender: persona, message: aiMessage });

            // AI 메시지도 Redis에 저장
            await redisClient.rPush(`chat:${socket.id}`, JSON.stringify({
              timestamp: new Date().toISOString(),
              sender: persona,
              message: aiMessage
            }));

            console.log('gpt 응답:', aiMessage);

            // TTS 생성 및 전송
            try {
              const audioData = await AIController.generateTTS(aiMessage, persona);
              io.emit('tts audio', { persona, audio: audioData.toString('base64') });
            } catch (ttsError) {
              console.error('Error generating TTS:', ttsError);
            }
          }
        };

        await AIController.chat(reqAI, resAI);
      } catch (error) {
        console.error('Error handling chat message:', error);
        io.emit('chat message', `Error getting AI response: ${error.message}`);
      }
    });

    socket.on('end chat', async () => {
      console.log('end chat event received');

      try {
        const { nickname, persona } = socket.data;

        // Redis에서 채팅 기록 가져오기
        const messages = await redisClient.lRange(`chat:${socket.id}`, 0, -1);
        const parsedMessages = messages.map((msg) => JSON.parse(msg));

        // MongoDB에 저장
        const chatLog = new ChatLog({
          userName: nickname,
          persona: persona, // 실제 페르소나 이름
          messages: parsedMessages.map(msg => ({
            sender: msg.sender,
            content: msg.message,
            timestamp: msg.timestamp
          }))
        });
        // MongoDB에 저장
        await chatLog.save();
        console.log('Chat log saved mongoDB', chatLog);
        // Redis에서 기록 삭제
        await redisClient.del(`chat:${socket.id}`);
        console.log('deleted from Redis');
      } catch (error) {
        console.error('Error saving chat log to MongoDB:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
