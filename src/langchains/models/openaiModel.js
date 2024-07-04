const { OpenAI } = require('openai');
const { openaiApiKey, openaiModel } = require('../../config/langchainConfig');

const openaiClient = new OpenAI({ apiKey: openaiApiKey });

class OpenAIModel {
  // 대화 생성
  static async chat(userMessage) {
    if (!userMessage) {
      throw new Error('userMessage is required');
    }

    try {
      const response = await openaiClient.createChatCompletion({
        model: openaiModel,
        messages: [
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,  // 최대 토큰 수
        temperature: 0.3  // 창의성
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  }

  // // 대화 요약
  // static async summarize(conversationHistory) {
  //   if (!conversationHistory || !conversationHistory.length) {
  //     throw new Error('conversationHistory is required');
  //   }

  //   const conversationText = conversationHistory
  //     .map(entry => `${entry.role}: ${entry.content}`)
  //     .join('\n');
  //   const summaryPrompt = `Please summarize the following conversation:\n\n${conversationText}`;
    
  //   try {
  //     const response = await openaiClient.createCompletion({
  //       model: openaiModel,
  //       prompt: summaryPrompt,
  //       max_tokens: 150,
  //       temperature: 0.3
  //     });
  //     return response.data.choices[0].text.trim();
  //   } catch (error) {
  //     console.error('Error generating summary:', error);
  //     throw error;
  //   }
  // }
}

module.exports = OpenAIModel;