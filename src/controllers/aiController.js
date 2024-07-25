const { luckyService, simonService, mzService, twentyQService } = require('../models/openAiModel');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { XI_API_KEY, getVoiceId, getTTSSettings } = require('../models/ttsModel');

class AIController {
  constructor() {
    this.openAIServices = {
      lucky: luckyService,
      simon: simonService,
      mz: mzService,
      twentyQ: twentyQService,
    };

    this.personaToModel = {
      '침착맨': 'twentyQ',
      '장원영': 'lucky',
      '쌈디': 'simon',
<<<<<<< Updated upstream
      '맑눈광': 'mz'
=======
      '김아영': 'mz'
>>>>>>> Stashed changes
    };

    this.chat = this.chat.bind(this);
    this.resetChat = this.resetChat.bind(this);
    this.generateTTS = this.generateTTS.bind(this);
  }

  getOpenAIService(persona) {
    return this.openAIServices[this.personaToModel[persona]];
  }

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

  async resetChat(req, res) {
    const { persona } = req.body;

    try {
      const service = this.getOpenAIService(persona);
      if (!service || typeof service.resetChat !== 'function') {
          throw new Error('Reset service is not properly configured');
      }
      service.resetChat();
      res.status(200).json({ message: 'Chat session reset successfully' });
    } catch (error) {
      console.error('Error resetting chat session:', error);
      res.status(500).json({ error: 'Error resetting chat session' });
    }
  }

  async generateTTS(text, persona){
    const voiceId = getVoiceId(persona);
    const settings = getTTSSettings(persona);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const headers = {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': XI_API_KEY
    };

    const data = {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: settings
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
