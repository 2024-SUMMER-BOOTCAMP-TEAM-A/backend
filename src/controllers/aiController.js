const { luckyService, simonService, mzService, twentyQService } = require('../models/openAiModel');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const XI_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!XI_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

class AIController {
  constructor() {
    this.openAIServices = {
      lucky: luckyService,
      simon: simonService,
      mz: mzService,
      twentyQ: twentyQService,
    };

    this.elevenLabsServices = {
      lucky: "SVYiBDZxdMa07D9wrXTI",
      simon: "YOUR_SIMON_VOICE_ID",
      mz: "YOUR_MZ_VOICE_ID",
      twentyQ: "YOUR_TWENTYQ_VOICE_ID",
    };

    this.personaToModel = {
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
    return this.openAIServices[this.personaToModel[persona]];
  }

  getVoiceId(persona) {
    const model = this.personaToModel[persona];
    return this.elevenLabsServices[model];
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
    const voiceId = this.getVoiceId(persona);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const headers = {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': XI_API_KEY
    };

    const data = {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    };

    try {
      const response = await axios.post(url, data, {
        headers: headers,
        responseType: 'arraybuffer'
      });

      return response.data;
    } catch (error) {
      console.error('Error during TTS process:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

module.exports = new AIController();
