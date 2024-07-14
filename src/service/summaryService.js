const { ChatLog, SummaryLog } = require('../models/chatLogModel.js');

const OpenAIService = require('../service/openAiService'); // OpenAIService 불러오기
const ImageService = require('../service/imageService'); // ImageService 불러오기

// summaryService 인스턴스 생성
const openaiConfig = require('../config/openAiConfig');
const promptFilePath = require('../prompt/summaryPrompt.json'); // 일지 프롬프트
const openaiService = new OpenAIService(openaiConfig.summary, promptFilePath);
const imageService = new ImageService(openaiService);


class SummaryService {
  // 일지 생성 및 저장
  async createSummary(chatLogId) { // chatLogId 받아오기
    if (!chatLogId) {
      throw new Error('chatLogId is required');
    }

    const chatLog = await ChatLog.findById(chatLogId);
    if (!chatLog) {
      throw new Error('Chat log not found');
    }

    const conversationHistory = chatLog.messages;
    const summary = await openaiService.summarize(conversationHistory); // 요약본 생성
    const image = imageService.generateAndUploadImage(summary); //url 반환
    const conclusion = await openaiService.createConclusion(summary); 

    const summaryLog = new SummaryLog({
      chatLogId: chatLogId,
      user: chatLog.userName,
      image: image,
      summary: summary,
      conclusion: conclusion,
      persona: chatLog.persona,
      createdAt: new Date(),
    }); // 일지 생성
    await summaryLog.save(); // 일지 저장

    return summaryLog;
  }

  // 일지 출력
  async getSummary(chatLogId) {
    if (!chatLogId) {
      throw new Error('chatLogId is required');
    }

    const summaryLog = await SummaryLog.findOne({ chatLogId });
    if (!summaryLog) {
      throw new Error('Summary not found');
    }

    return summaryLog;
  }
}

module.exports = SummaryService;
