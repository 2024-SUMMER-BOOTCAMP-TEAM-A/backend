const { ChatLog, SummaryLog } = require('../models/chatLogModel.js');
const { summaryService, solutionService } = require('../models/openAiModel');
const ImageService = require('../service/imageService');

const openaiConfig = require('../config/openAiConfig');
const imagePromptFilePath = '../prompt/picturePrompt.json'; 
const imageService = new ImageService(openaiConfig.image, imagePromptFilePath);

class SummaryService {
  // 일지 생성 및 저장
  async createSummary(chatLogId) {
    if (!chatLogId) {
      console.error('chatLogId is required');
      throw new Error('chatLogId is required');
    }

    console.log(`Fetching ChatLog with id: ${chatLogId}`);
    const chatLog = await ChatLog.findById(chatLogId);
    if (!chatLog) {
      console.error(`ChatLog not found for id: ${chatLogId}`);
      throw new Error('ChatLog not found');
    }

    const conversationHistory = chatLog.messages;

    try {
      console.log('Generating summary from prompt');
      const summary = await summaryService.summarize(conversationHistory);
      console.log('Summary generated successfully:', summary);

      console.log('Generating image from prompt');
      const image = await imageService.generateAndUploadImage(summary);
      console.log('Image generated successfully:', image);

      console.log('Generating conclusion from summary');
      const conclusion = await solutionService.createConclusion(summary);
      console.log('Conclusion generated successfully:', conclusion);

      console.log('Creating SummaryLog object');
      const summaryLog = new SummaryLog({
        chatLogId: chatLogId,
        user: chatLog.userName,
        image: image,
        summary: summary,
        conclusion: conclusion,
        persona: chatLog.persona,
        createdAt: new Date(),
      });

      console.log('Saving SummaryLog object');
      await summaryLog.save();
      console.log('SummaryLog saved successfully:', summaryLog);

      return summaryLog;
    } catch (error) {
      console.error(`Error generating and saving summary for chatLogId ${chatLogId}:`, error);
      throw error;
    }
  }

  // 일지 출력
  async getSummary(summaryLogId) {
    if (!summaryLogId) {
      console.error('summaryLogId is required');
      throw new Error('summaryLogId is required');
    }

    console.log(`Fetching SummaryLog with id: ${summaryLogId}`);
    const summaryLog = await SummaryLog.findById(summaryLogId);
    if (!summaryLog) {
      console.error(`SummaryLog not found for id: ${summaryLogId}`);
      throw new Error('SummaryLog not found');
    }

    console.log('SummaryLog fetched successfully:', summaryLog);
    return summaryLog;
  }
}

module.exports = new SummaryService();
