const OpenAIModel = require('./models/openaiModel');
const ClovaTtsModel = require('./models/clovaTtsModel');

class LangChainClient {
  constructor() {
    this.openAI = OpenAIModel;
    this.clovaTTS = ClovaTtsModel;
  }

  // 대화
  async chatWithOpenAI(prompt) {
    return this.openAI.chat(prompt, options);
  }

  // 요약
  async summarizeConversation(conversationHistory, options = {}) {
    return this.openAI.summarize(conversationHistory, options);
  }

  // TTS 생성
  async generateTTS(text) {
    return this.clovaTTS.generateSpeech(text, options);
  }
}

module.exports = new LangChainClient();
