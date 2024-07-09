const { defaultService: openAIDefaultService, luckyService, simonService, mzService, twentyQService } = require('../models/openAiModel');
const { defaultService: clovaDefaultService, luckyService: clovaLuckyService, simonService: clovaSimonService, mzService: clovaMzService, twentyQService: clovaTwentyQService } = require('../models/clovaModel');

class AIController {
  constructor() {
    this.openAIServices = {
      default: openAIDefaultService,
      lucky: luckyService,
      simon: simonService,
      mz: mzService,
      twentyQ: twentyQService,
    };

    this.clovaServices = {
      default: clovaDefaultService,
      lucky: clovaLuckyService,
      simon: clovaSimonService,
      mz: clovaMzService,
      twentyQ: clovaTwentyQService,
    };

    this.chat = this.chat.bind(this);
    this.resetChat = this.resetChat.bind(this);
    this.tts = this.tts.bind(this);
  }

  // 인격에 맞는 서비스 선택
  getOpenAIService(persona) {
    return this.openAIServices[persona] || this.openAIServices.default;
  }

  getClovaService(persona) {
    return this.clovaServices[persona] || this.clovaServices.default;
  }

  // 대화 생성
  async chat(req, res) {
    const { userMessage, persona } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
      const service = this.getOpenAIService(persona);
      const response = await service.chat(userMessage);
      res.json({ response });
    } catch (error) {
      console.error('Error generating chat response:', error);
      res.status(500).json({ error: 'Error generating chat response' });
    }
  }

  // 대화 초기화
  async resetChat(req, res) {
    const { persona } = req.body;

    try {
      const service = this.getOpenAIService(persona);
      service.resetChat();  // 대화 상태를 초기화합니다.
      res.status(200).json({ message: 'Chat session reset successfully' });
    } catch (error) {
      console.error('Error resetting chat session:', error);
      res.status(500).json({ error: 'Error resetting chat session' });
    }
  }

  // tts
  async tts(req, res) {
    const { text, persona } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    try {
      const service = this.getClovaService(persona);
      const audioData = await service.generateSpeech(text);
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioData);
    } catch (error) {
      console.error('Error generating TTS:', error);
      res.status(500).json({ error: 'Error generating TTS' });
    }
  }
}

module.exports = new AIController();
