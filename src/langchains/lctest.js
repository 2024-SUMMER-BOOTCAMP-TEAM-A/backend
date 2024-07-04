// src/langchains/lctest.js

const OpenAIModel = require('./models/openaiModel');  // 올바른 경로로 수정

(async () => {
  try {
    // 대화 생성 테스트
    console.log('Sending message: "Hello, how are you?"');
    let response = await OpenAIModel.chat('Hello, how are you?');
    console.log('AI Response:', response);

    console.log('Sending message: "What is the weather like today?"');
    response = await OpenAIModel.chat('What is the weather like today?');
    console.log('AI Response:', response);

    // 대화 초기화
    console.log('Resetting chat...');
    OpenAIModel.resetChat();
    console.log('Chat session reset successfully');

    // 초기화 후 대화
    console.log('Sending message: "What is your name?"');
    response = await OpenAIModel.chat('What is your name?');
    console.log('AI Response after reset:', response);
  } catch (error) {
    console.error('Error:', error);
  }
})();