const summaryService = require('../service/summaryService');

class SummaryController {
  // 요약 및 저장
  async createsaveSummary(req, res) {
    const { chatLogId } = req.body; // 몽고DB에서 가져옴

    if (!chatLogId) {
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      const summaryLog = await summaryService.createSummary(chatLogId);
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
      const summaryLog = await summaryService.getSummary(chatLogId);
      res.json({ summaryLog });
    } catch (error) {
      console.error('Error retrieving summary:', error);
      res.status(500).json({ error: 'Error retrieving summary' });
    }
  }
}

module.exports = new SummaryController();
