const { Configuration, OpenAIApi } = require('openai');
const { openaiApiKey, openaiModel } = require('../../config/langchainConfig');

const configuration = new Configuration({apiKey: openaiApiKey});
const openaiClient = new OpenAIApi(configuration);

class OpenAIModel {
  //대화
  static async chat(prompt) {
    try {
      const response = await openaiClient.createChatCompletion({
        model: openaiModel,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150, //최대 토큰 수
        temperature: 0.3 //창의성
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  }

  //요약
  static async summarize(conversationHistory) {
    const conversationText = conversationHistory.map(entry => `${entry.role}: ${entry.content}`).join('\n');
    const summaryPrompt = `Please summarize the following conversation:\n\n${conversationText}`;
    
    try {
      const response = await openaiClient.createCompletion({
        model: openaiModel,
        prompt: summaryPrompt,
        max_tokens: 150,
        temperature: 0.3
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }
}

module.exports = OpenAIModel;