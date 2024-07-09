const { ChatLog, SummaryLog } = require('../models/summaryModel');
const OpenAIService = require('../service/openAiService'); // OpenAIService 불러오기
const ImageService = require('../service/imageService'); // ImageService 불러오기

class SummaryService {
  constructor(openaiService, imageService) {
    this.openaiService = openaiService;
    this.imageService = imageService;
  }

  // 요약 생성 및 저장
  async createSummary(chatLogId) {
    if (!chatLogId) {
      throw new Error('chatLogId is required');
    }

    const chatLog = await ChatLog.findById(chatLogId);
    if (!chatLog) {
      throw new Error('Chat log not found');
    }

    const conversationHistory = chatLog.messages;
    const summary = await this.openaiService.summarize(conversationHistory); // 요약본 생성
    const conclusion = "결론 내용"; // 필요한 경우 실제 결론 생성 로직 추가

    const summaryLog = new SummaryLog({
      chatLogId: chatLogId,
      summary: summary,
      conclusion: conclusion,
      createdAt: new Date(),
    }); // 일지 생성
    await summaryLog.save(); // 일지 저장

    return summaryLog;
  }

  // 요약본 출력
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

  // 이미지 생성 및 업로드
  async generateAndUploadImage(req, res) {
    const { prompt, persona } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    try {
      const imageUrl = await this.imageService.generateAndUploadImage(prompt);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Error generating or uploading image:', error);
      res.status(500).json({ error: 'Error generating or uploading image' });
    }
  }
}

// summaryService 인스턴스 생성
const openaiConfig = require('../config/openAiConfig');
const openaiService = new OpenAIService(openaiConfig.summary);
const imageService = new ImageService(openaiService);
const summaryService = new SummaryService(openaiService, imageService);

module.exports = summaryService;
