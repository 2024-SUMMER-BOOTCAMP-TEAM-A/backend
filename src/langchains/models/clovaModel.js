const axios = require('axios');
const querystring = require('querystring');
const { clova } = require('../../config/langchainConfig');
const fs = require('fs');

const TTS_API_URL = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';

class ClovaTtsModel {
  constructor() {
    this.clientId = clova.clientId;
    this.apiKeySecret = clova.apiKeySecret;

    // 환경 변수가 올바르게 설정되었는지 로그 출력
    console.log('Clova Client ID:', this.clientId);
    console.log('Clova API Key Secret:', this.apiKeySecret);
  }

  async generateSpeech(text) {
    try {
      const data = querystring.stringify({
        speaker: 'nara',
        text: text,
        volume: '0',
        speed: '0',
        pitch: '0',
        format: 'mp3',
      });

      const response = await axios.post(TTS_API_URL, data, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': this.clientId,
          'X-NCP-APIGW-API-KEY': this.apiKeySecret,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'arraybuffer', // 응답 데이터를 buffer로 받음
      });

      const writeStream = fs.createWriteStream('./tts1.mp3'); // 파일로 출력할 스트림 생성
      writeStream.write(response.data); // 파일에 데이터를 씀
      writeStream.end(); // 스트림 끝냄

      console.log('TTS 파일 생성 완료.');
    } catch (error) {
      console.error('Error generating TTS:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

module.exports = ClovaTtsModel;
