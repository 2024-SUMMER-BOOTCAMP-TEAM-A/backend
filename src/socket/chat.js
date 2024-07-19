const AIController = require('../controllers/aiController');
const userSelectionController = require('../controllers/userSelectionController');
const { ChatLog } = require('../models/chatLogModel');
const speechClient = require('../config/sttConfig'); // sttConfig 파일에서 speechClient 가져오기
const ImageService = require('../service/imageService'); // 이미지 서비스 파일 경로를 지정하세요

module.exports = (io, redisClient) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('start chat', async (data) => {
            const { token } = data;
            console.log('start chat event received:', data);

            try {
                if (socket.data.chatStarted) {
                    console.log('Chat already started for this socket');
                    return;
                }
                socket.data.chatStarted = true;

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
            await handleChatMessage(socket, redisClient, msg.content);
        });

        let recognizeStream = null;

        function startRecognitionStream() {
            if (recognizeStream) {
                recognizeStream.end();
                recognizeStream = null;
            }

            recognizeStream = speechClient
                .streamingRecognize({
                    config: {
                        encoding: 'WEBM_OPUS',
                        sampleRateHertz: 16000,
                        languageCode: 'ko-KR',
                    },
                    interimResults: false,
                })
                .on('data', async (data) => {
                    let transcript = data.results[0].alternatives[0].transcript;
                    transcript = transcript.replace(/(\r\n|\n|\r)/gm, ''); // 개행 문자 제거
                    console.log('Transcript received:', transcript);
                    socket.emit('transcript', { sender: socket.data.nickname, message: transcript });

                    // Transcript를 chat message 이벤트로 보내기
                    console.log('Emitting chat message event for transcript:', transcript);
                    await handleChatMessage(socket, redisClient, transcript);
                })
                .on('error', (err) => {
                    console.error('Error during streaming:', err);
                    if (recognizeStream) {
                        recognizeStream.end();
                        recognizeStream = null;
                    }
                })
                .on('end', () => {
                    console.log('Streaming ended');
                    recognizeStream = null;
                });
        }

        socket.on('start stt', () => {
            console.log('start stt event received');
            startRecognitionStream();
        });

        socket.on('audio message', (message) => {
            console.log('audio message event received');
            if (recognizeStream) {
                try {
                    recognizeStream.write(message);
                } catch (error) {
                    console.error('Error writing to recognizeStream:', error);
                }
            } else {
                console.error('recognizeStream is not initialized or has ended.');
            }
        });

        socket.on('end stt', () => {
            console.log('end stt event received');
            if (recognizeStream) {
                recognizeStream.end();
                recognizeStream = null;
            }
        });

        socket.on('end chat', async () => {
            console.log('end chat event received');

            const imageService = new ImageService({
                apiKey: process.env.OPENAI_API_KEY // 필요한 환경 변수를 설정하세요
            });

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
                console.log('Chat log saved to MongoDB:', chatLog);
                // Redis에서 기록 삭제
                await redisClient.del(`chat:${socket.id}`);

                console.log('Deleted from Redis');

                // 안전한 프롬프트 생성
                const prompt = parsedMessages.map(msg => msg.message).join(' ');
                const safePrompt = prompt.replace(/[^a-zA-Z0-9가-힣\s]/g, '');

                // 프롬프트 JSON 파일 로드
                const picturePromptJson = ImageService.loadPicturePrompt();
                if (picturePromptJson) {
                    const combinedPrompt = `${safePrompt} ${JSON.stringify(picturePromptJson)}`;
                    try {
                        const imageUrl = await imageService.generateAndUploadImage(combinedPrompt);
                        console.log('Image URL:', imageUrl);

                        // 클라이언트에게 이미지 URL 전송
                        socket.emit('image url', { url: imageUrl });
                    } catch (error) {
                        console.error('Error generating or uploading image:', error);
                        socket.emit('error', { message: 'Error generating or uploading image', error: error.message });
                    }
                } else {
                    console.error('Error loading picture prompt JSON');
                }

            } catch (error) {
                console.error('Error handling end chat event:', error);
                socket.emit('error', { message: 'Error ending chat', error: error.message });
            }

            if (recognizeStream) {
                recognizeStream.end();
                recognizeStream = null;
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            if (recognizeStream) {
                recognizeStream.end();
                recognizeStream = null;
            }
        });
    });

    async function handleChatMessage(socket, redisClient, content) {
        content = content.replace(/(\r\n|\n|\r)/gm, '').trim(); // 개행 문자 및 양쪽 공백 제거
        console.log('Received chat message:', content);

        try {
            const { nickname, persona } = socket.data;

            if (!nickname || !persona) {
                console.error('Nickname or persona not set for this socket.');
                return socket.emit('chat message', { sender: 'Error', message: 'Nickname or persona not set.' });
            }

            // 메시지를 Redis에 저장
            await redisClient.rPush(`chat:${socket.id}`, JSON.stringify({
                timestamp: new Date().toISOString(),
                sender: nickname, // msg.sender가 없으면 nickname 사용
                message: content
            }));

            // Redis에서 전체 채팅 로그 가져오기
            const messages = await redisClient.lRange(`chat:${socket.id}`, 0, -1);
            const redisLogs = messages.map((msg) => JSON.parse(msg));
            console.log('Redis logs:', redisLogs);

            // Express req, res 객체 모의
            const reqAI = {
                body: { userMessage: content, persona: persona, chatLog: redisLogs }
            };
            console.log('Sending message to GPT:', reqAI.body);

            const resAI = {
                json: async (data) => {
                    console.log('Received response from GPT:', data);
                    // 클라이언트에게 AI 응답 전송
                    const aiMessage = data.response;
                    socket.emit('chat message', { sender: persona, message: aiMessage });

                    // AI 메시지도 Redis에 저장
                    await redisClient.rPush(`chat:${socket.id}`, JSON.stringify({
                        timestamp: new Date().toISOString(),
                        sender: persona,
                        message: aiMessage
                    }));

                    console.log('GPT response:', aiMessage);

                    // TTS 생성 및 전송
                    try {
                        const audioData = await AIController.generateTTS(aiMessage, persona);
                        socket.emit('tts audio', { persona, audio: audioData.toString('base64') });
                    } catch (ttsError) {
                        console.error('Error generating TTS:', ttsError);
                    }
                }
            };

            console.log('Calling AIController.chat');
            await AIController.chat(reqAI, resAI);
            console.log('AIController.chat completed');
        } catch (error) {
            console.error('Error handling chat message:', error);
            socket.emit('chat message', { sender: 'Error', message: `Error getting AI response: ${error.message}` });
        }
    }
};
