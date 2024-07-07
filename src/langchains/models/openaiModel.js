require('dotenv').config();
const { OpenAI } = require('openai');
const { openai } = require('../../config/langchainConfig');
const {Storage} = require('@google-cloud/storage');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const openaiClient = new OpenAI({ apiKey: openai.apiKey });
const storage = new Storage();
const bucketName = GCLOUD_STORAGE_BUCKET;

class OpenAIModel {
  constructor() {
    this.messages = [];  // 대화 상태를 유지할 메시지 배열
  }

  async chat(userMessage) {
    if (!userMessage) {
      throw new Error('userMessage is required');
    }

    // 새로운 사용자 메시지를 대화 상태에 추가합니다.
    this.messages.push({ role: 'user', content: userMessage });

    try {
      // OpenAI API를 호출하여 대화 응답을 생성합니다.
      const response = await openaiClient.chat.completions.create({
        model: openai.model,  // 사용할 모델을 설정합니다.
        messages: this.messages,  // 대화 상태에 있는 모든 메시지를 전송합니다.
        max_tokens: 150,  // 최대 토큰 수
        temperature: 0.7  // 생성의 창의성 정도
      });

      // 응답 전체를 로그로 출력
      console.log('OpenAI API response:', JSON.stringify(response, null, 2));

      // OpenAI의 응답 메시지를 대화 상태에 추가합니다.
      if (response && response.choices && response.choices.length > 0) {
        const aiMessage = response.choices[0].message.content;
        this.messages.push({ role: 'assistant', content: aiMessage });
        return aiMessage;
      } else {
        throw new Error('Invalid response structure from OpenAI API');
      }
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  }

  // 대화 초기화
  resetChat() {
    this.messages = [];  // 대화 상태를 초기화합니다.
  }

  // 대화 요약
  async summarize(conversationHistory) {
    if (!conversationHistory || !conversationHistory.length) {
      throw new Error('conversationHistory is required');
    }

    const conversationText = conversationHistory
      .map(entry => `${entry.role}: ${entry.content}`)
      .join('\n');
    const summaryPrompt = { role: 'system', content: `Please summarize the following conversation:\n\n${conversationText}` };
    
    try {
      const response = await openaiClient.chat.completions.create({
        model: openai.Model,
        messages: [summaryPrompt],
        max_tokens: 150,
        temperature: 0.3,
      });
      if (!response || !response.choices || !response.choices[0].message.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  // 요약 토대로 이미지 생성
  async generateImage(summary) {
    if(!summary) {throw new Error('summary is required');}

    const response = await openai.creatImage({
      prompt: summary,
      n: 1,
      size: "1792x1024",
    })

    const imageUrl = response.data.data[0].url;
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    return imageBuffer;
  }

  // 이미지 업로드
  async uploadImageToGCS(buffer, fileName) {
    const tempFilePath = path.join('/tmp', fileName);
    fs.writeFileSync(tempFilePath, buffer);

    await storage.bucket(bucketName).upload(tempFilePath, {
      destination: fileName,
    });

    fs.unlinkSync(tempFilePath);
    console.log(`Image uploaded to ${bucketName}/${fileName}`);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`; // 이미지 링크 생성
    return publicUrl;
  }

  //생성 + 업로드
  async generateAndUploadImage(prompt) {
    try {
      const imageBuffer = await this.generateImage(prompt);
      const fileName = `${Date.now()}-generated-image.png`;

      const publicUrl = await this.uploadImageToGCS(imageBuffer, fileName);

      console.log(`Generated and uploaded image for prompt: "${prompt}"`);
    } catch (error) {
      console.error('Error generating or uploading image:', error);
      throw error;
    }
  }

  //사용 : 링크 불러오기
}

module.exports = OpenAIModel;
