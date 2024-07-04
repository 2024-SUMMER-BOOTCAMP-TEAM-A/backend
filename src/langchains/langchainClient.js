const OpenAIModel = require('./models/openaiModel');

class LangChainClient {
  constructor() {
    this.openAI = OpenAIModel;
  }

  // 대화 생성
  static async generateChatResponse(userMessage) {
    if (!userMessage) {
      throw new Error('userMessage is required');
    }
    return OpenAIModel.chat(userMessage);
  }

  // 대화 요약
  static async generateSummary(conversationHistory) {
    if (!conversationHistory || !conversationHistory.length) {
      throw new Error('conversationHistory is required');
    }
    return OpenAIModel.summarize(conversationHistory);
  }
}

module.exports = new LangChainClient();