const summaryService = require('../service/summaryService');

class SummaryController {
  constructor() {
    this.summaryService = summaryService;
  }

  // 요약 및 저장
  async createsaveSummary(req, res) {
    const { chatLogId } = req.body;

    if (!chatLogId) {
      console.error('Error: Missing chatLogId in request body');
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      console.log(`Generating summary for chatLogId: ${chatLogId}`);
      const summaryLog = await this.summaryService.createSummary(chatLogId);
      console.log('Summary created successfully:', summaryLog);
      res.json({ summaryLog });
    } catch (error) {
      console.error(`Error generating and saving summary for chatLogId ${chatLogId}:`, error);
      res.status(500).json({ error: 'Error generating and saving summary' });
    }
  }

  // 요약본 출력
  async getSummary(req, res) {
    const { chatLogId } = req.params;

    if (!chatLogId) {
      console.error('Error: Missing chatLogId in request parameters');
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      console.log(`Retrieving summary for chatLogId: ${chatLogId}`);
      const summaryLog = await this.summaryService.getSummary(chatLogId);
      if (!summaryLog) {
        console.warn(`No summary found for chatLogId ${chatLogId}`);
        return res.status(404).json({ message: 'Summary not found' });
      }
      console.log('Summary retrieved successfully:', summaryLog);
      res.json({ summaryLog });
    } catch (error) {
      console.error(`Error retrieving summary for chatLogId ${chatLogId}:`, error);
      res.status(500).json({ error: 'Error retrieving summary' });
    }
  }
}

module.exports = new SummaryController();