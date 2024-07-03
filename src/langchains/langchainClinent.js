const OpenAIModel = require('./models/openaiModel');
const ClovaTtsModel = require('./models/clovaTtsModel');

class LangChainClient {
  constructor() {
    this.openAIModel = OpenAIModel;
    this.clovaTtsModel = ClovaTtsModel;
  }

  //대화
  async chat(prompt) {
    return await this.openAIModel.chat(prompt);
  }

  //요약
  async summarize(text) {
    return await this.openAIModel.summarize(text);
  }

  //클로바 tts
  async generateSpeech(text) {
    return await this.clovaTtsModel.generateSpeech(text);
  }
}

module.exports = new LangChainClient();