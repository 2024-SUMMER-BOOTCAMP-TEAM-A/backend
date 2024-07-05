const logChain = require('./logChain');

class LogService {
  // 채팅 로그를 요약하고 저장
  async createSummary(chatLogId) {
    if (!chatLogId) {
      throw new Error('chatLogId is required');
    }

    try {
      const summaryLog = await logChain.createSummary(chatLogId);
      return summaryLog;
    } catch (error) {
      console.error('Error generating and saving summary:', error);
      throw error;
    }
  }

  // 요약본을 출력
  async getSummary(chatLogId) {
    if (!chatLogId) {
      throw new Error('chatLogId is required');
    }

    try {
      const summaryLog = await logChain.getSummary(chatLogId);
      return summaryLog;
    } catch (error) {
      console.error('Error retrieving summary:', error);
      throw error;
    }
  }
}

module.exports = new LogService();