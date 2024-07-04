const OpenAIModel = require('./models/openaiModel');

class LangChainClient {
  constructor() {
    this.messages = [];
  }

  // 대화
  static async generateChatResponse(userMessage) {
    return OpenAIModel.chat(userMessage);
  }

  // // 대화 요약
  // static async generateSummary(conversationHistory) {
  //   if (!conversationHistory || !conversationHistory.length) {
  //     throw new Error('conversationHistory is required');
  //   }
  //   return OpenAIModel.summarize(conversationHistory);
  // }
}

module.exports = new LangChainClient();