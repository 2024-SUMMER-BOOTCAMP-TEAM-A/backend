const langchainClient = require('../langchains/langchainClient');

const OpenAIModel = require('../langchains/models/openaiModel');
const ClovaTtsModel = require('../langchains/models/clovaModel'); 

class AIController {
  constructor() {
    this.openAIModelInstance = new OpenAIModel(); // 인스턴스 생성
    this.clovaTtsModelInstance = new ClovaTtsModel(); // ClovaTtsModel 인스턴스 생성
  }

  // 대화 생성
  async chat(req, res) {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
      const response = await this.openAIModelInstance.chat(userMessage);
      res.json({ response });
    } catch (error) {
      console.error('Error generating chat response:', error);
      res.status(500).json({ error: 'Error generating chat response' });
    }
  }

  // 대화 초기화
  async resetChat(req, res) {
    try {
      this.openAIModelInstance.resetChat();  // 대화 상태를 초기화합니다.
      res.status(200).json({ message: 'Chat session reset successfully' });
    } catch (error) {
      console.error('Error resetting chat session:', error);
      res.status(500).json({ error: 'Error resetting chat session' });
    }
  }

  // 대화 요약
  async summarize(req, res) {
    const { conversationHistory } = req.body;

    if (!conversationHistory || !conversationHistory.length) {
      return res.status(400).json({ error: 'conversationHistory is required' });
    }

    try {
      const summary = await this.openAIModelInstance.summarize(conversationHistory);
      res.json({ summary });
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      res.status(500).json({ error: 'Error generating conversation summary' });
    }
  }

  // tts
  async tts(req, res) {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    try {
      const audioData = await this.clovaTtsModelInstance.generateSpeech(text);
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioData);
    } catch (error) {
      console.error('Error generating TTS:', error);
      res.status(500).json({ error: 'Error generating TTS' });
    }
  }
}

module.exports = AIController;
