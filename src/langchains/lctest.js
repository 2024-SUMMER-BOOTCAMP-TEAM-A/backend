const langchainClient = require('../langchains/langchainClient');

(async () => {
  try {
    const response = await langchainClient.generateChatResponse('Hello, how are you?');
    console.log(response); // 응답 내용을 확인합니다.
  } catch (error) {
    console.error('Error:', error);
  }
})();
