const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const TTS_API_URL = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';

class ClovaTtsService {
  constructor(config) {
    this.clientId = config.clientId;
    this.apiKeySecret = config.apiKeySecret;
    this.speaker = config.speaker;
    this.volume = config.volume;
    this.speed = config.speed;
    this.pitch = config.pitch;
    this.format = config.format;

    console.log('Clova Client ID:', this.clientId);
    console.log('Clova API Key Secret:', this.apiKeySecret);
  }

  async generateSpeech(text) {
    try {
      const data = querystring.stringify({
        speaker: this.speaker,
        text: text,
        volume: this.volume,
        speed: this.speed,
        pitch: this.pitch,
        format: this.format,
      });

      const response = await axios.post(TTS_API_URL, data, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': this.clientId,
          'X-NCP-APIGW-API-KEY': this.apiKeySecret,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'arraybuffer',
      });

      console.log('TTS 생성 및 저장');
      return response.data; // Return the audio data directly
    } catch (error) {
      console.error('Error generating TTS:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

module.exports = ClovaTtsService;
