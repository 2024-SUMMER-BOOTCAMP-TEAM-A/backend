const { Configuration, OpenAIApi } = require('openai');
const { openaiApiKey, openaiModel } = require('../../config/langchainConfig');

const configuration = new Configuration({apiKey: openaiApiKey,});
const openaiClient = new OpenAIApi(configuration);

class OpenAIModel {
  //상담
  async chat(prompt) {
    try {
      const response = await openaiClient.createChatCompletion({
        model: openaiModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150, //최대 토큰 수
        temperature: 0.3, //창의성
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  }

  //요약
  async summarize(text) {
    try {
      const response = await openaiClient.createCompletion({
        model: openaiModel,
        prompt: `Please summarize the following text:\n\n${text}`,
        max_tokens: 150,
        temperature: 0.3,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIModel();
