const logService = require('./logService');

class LogController {
  // 채팅 로그를 요약하고 저장
  async createSummary(req, res) {
    const { chatLogId } = req.body;

    if (!chatLogId) {
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      const summaryLog = await logService.createSummary(chatLogId);
      res.json({ summaryLog });
    } catch (error) {
      console.error('Error generating and saving summary:', error);
      res.status(500).json({ error: 'Error generating and saving summary' });
    }
  }

  // 요약본을 출력
  async getSummary(req, res) {
    const { chatLogId } = req.params;

    if (!chatLogId) {
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      const summaryLog = await logService.getSummary(chatLogId);
      res.json({ summaryLog });
    } catch (error) {
      console.error('Error retrieving summary:', error);
      res.status(500).json({ error: 'Error retrieving summary' });
    }
  }
}

module.exports = new LogController();
