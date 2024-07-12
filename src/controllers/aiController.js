const { luckyService, simonService, mzService, twentyQService } = require('../models/openAiModel');
const { luckyService: clovaLuckyService, simonService: clovaSimonService, mzService: clovaMzService, twentyQService: clovaTwentyQService } = require('../models/clovaModel');

class AIController {
  constructor() {
    this.openAIServices = {
      lucky: luckyService,
      simon: simonService,
      mz: mzService,
      twentyQ: twentyQService,
    };

    this.clovaServices = {
      lucky: clovaLuckyService,
      simon: clovaSimonService,
      mz: clovaMzService,
      twentyQ: clovaTwentyQService,
    };

    this.personaToClovaModel = {
      '침착맨': 'twentyQ',
      '장원영': 'lucky',
      '쌈디': 'simon',
      '맑눈광': 'mz'
    };

    this.chat = this.chat.bind(this);
    this.resetChat = this.resetChat.bind(this);
    this.generateTTS = this.generateTTS.bind(this);
  }

  // 인격에 맞는 서비스 선택
  getOpenAIService(persona) {
    return this.openAIServices[this.personaToClovaModel[persona]];
  }

  getClovaService(persona) {
    const clovaModel = this.personaToClovaModel[persona];
    console.log(`Fetching Clova service for persona: ${persona} (model: ${clovaModel})`);
    return this.clovaServices[clovaModel];
  }

  // 대화 생성
  async chat(req, res) {
    const { userMessage, persona } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
        const service = this.getOpenAIService(persona);
        if (!service || typeof service.chat !== 'function') {
            throw new Error('Chat service is not properly configured');
        }

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
      if (!service || typeof service.resetChat !== 'function') {
          throw new Error('Reset service is not properly configured');
      }
      service.resetChat();  // 대화 상태를 초기화합니다.
      res.status(200).json({ message: 'Chat session reset successfully' });
    } catch (error) {
      console.error('Error resetting chat session:', error);
      res.status(500).json({ error: 'Error resetting chat session' });
    }
  }

  // TTS 생성
  async generateTTS(text, persona){
    try {
      const service = this.getClovaService(persona);
      const audioData = await service.generateSpeech(text);
      return audioData;
    } catch (error) {
      console.error('Error generating TTS:', error);
      throw error;
    }
  }
}

module.exports = new AIController();
