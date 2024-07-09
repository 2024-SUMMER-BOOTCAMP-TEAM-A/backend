const { summaryService } = require('../models/openAiModel');

class SummaryController {
  constructor() {
    this.summaryService = summaryService;
  }

  // 일지 생성 및 저장
  async createSummary(req, res) {
    const { chatLogId } = req.body;

    if (!chatLogId) {
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      const summaryLog = await this.summaryService.createSummary(chatLogId);
      res.json({ summaryLog });
    } catch (error) {
      console.error('Error generating and saving summary:', error);
      res.status(500).json({ error: 'Error generating and saving summary' });
    }
  }

  // 요약본 출력
  async getSummary(req, res) {
    const { chatLogId } = req.params;

    if (!chatLogId) {
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      const summaryLog = await this.summaryService.getSummary(chatLogId);
      res.json({ summaryLog });
    } catch (error) {
      console.error('Error retrieving summary:', error);
      res.status(500).json({ error: 'Error retrieving summary' });
    }
  }

  // 대화 요약
  async summarize(req, res) {
    const { conversationHistory } = req.body;

    if (!conversationHistory || !conversationHistory.length) {
      return res.status(400).json({ error: 'conversationHistory is required' });
    }

    try {
      const summary = await this.summaryService.summarize(conversationHistory);
      res.json({ summary });
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      res.status(500).json({ error: 'Error generating conversation summary' });
    }
  }

  // 이미지 생성 및 업로드
  async generateAndUploadImage(req, res) {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    try {
      const imageUrl = await this.summaryService.generateAndUploadImage(prompt);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Error generating or uploading image:', error);
      res.status(500).json({ error: 'Error generating or uploading image' });
    }
  }
}

module.exports = new SummaryController();
