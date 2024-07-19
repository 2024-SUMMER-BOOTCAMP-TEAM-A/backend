require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs').promises;

class OpenAIService {
  constructor(config, promptFilePath) {
    this.config = config;
    this.openaiClient = new OpenAI({ apiKey: config.apiKey });
    this.promptFilePath = promptFilePath;
    this.messages = [];
  }

  // 인격 불러오기
  async loadInitialPrompt() {
    try {
      const promptContent = await fs.readFile(this.promptFilePath, 'utf8');
      this.messages.push({ role: 'system', content: promptContent });
    } catch (error) {
      console.error('Error loading initial prompt:', error);
      throw error;
    }
  }

  // 대화 기능
  async chat(userMessage) {
    if (!userMessage) {
      throw new Error('userMessage is required');
    }

    if (this.messages.length === 0) {
      await this.loadInitialPrompt();
    }

    this.messages.push({ role: 'user', content: userMessage });

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: this.config.model,
        messages: this.messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      console.log('OpenAI API response:', JSON.stringify(response, null, 2));

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
    this.messages = [];
  }

  // 대화 요약
  async summarize(conversationHistory) {
    if (!conversationHistory || !conversationHistory.length) {
      throw new Error('conversationHistory is required');
    }

    const conversationText = conversationHistory
      .map(entry => `${entry.role}: ${entry.content}`)
      .join('\n');
    const summaryPrompt = { role: 'system', content: `대화의 주된 내용들을 요약해줘. 150자정도로. 대신 결론은 포함하지 마.:\n\n${conversationText}` };

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: this.config.model,
        messages: [summaryPrompt],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
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

  // 결론 생성
  async createConclusion(summarize) {
    if (!summarize) {
      throw new Error('summarize is required');
    }

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'system', content: summarize }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });
      if (!response || !response.choices || !response.choices[0].message.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating conclusion:', error);
      throw error;
    }
  }

  // 이미지 생성
  async createImage(summary) {
    if (!summary) {
      throw new Error('summary is required');
    }

    try {
      const response = await this.openaiClient.images.create({
        prompt: summary,
        n: 1,
        size: "1024x1792",
      });
      if (!response || !response.data || !response.data[0].url) {
        throw new Error('Invalid response from OpenAI API');
      }
      return response.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}

module.exports = OpenAIService;
