const axios = require('axios');
const { clovaApiKey, clovaModel } = require('../../config/langchainConfig');  // Clova API 키와 모델 정보를 가져옵니다.

const TTS_API_URL = 'https://clova.ai/tts/v1/tts';

class ClovaTtsModel {
    constructor() {
      this.apiKey = clovaApiKey;
      this.model = clovaModel;
    }
  
    async generateSpeech(text) {
      try {
        const response = await axios.post(TTS_API_URL, {
          speaker: this.model,
          text: text,
          speed: 1.0, //속도
          pitch: 1.0, //높이
          volume: 1.0 //볼륨
        }, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer'
        });
  
        return response.data;
      } catch (error) {
        console.error('Error generating TTS:', error);
        throw error;
      }
    }
  }
  
  module.exports = new ClovaTtsModel();
