const OpenAIModel = require('./models/openaiModel');

class LangChainClient {
  constructor() {
    this.messages = [];
  }

  // 대화
  static async generateChatResponse(userMessage) {
    return OpenAIModel.chat(userMessage);
  }

  // 요약
  static async generateSummary(conversationHistory) {
    return OpenAIModel.summarize(conversationHistory);
  }
}

module.exports = new LangChainClient();