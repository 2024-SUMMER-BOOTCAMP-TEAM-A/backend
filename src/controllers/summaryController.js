const summaryService = require('../service/summaryService');
const imageService = require('../service/imageService');

class SummaryController {
  // 요약 및 저장
  async createsaveSummary(req, res) {
    const { chatLogId } = req.body;

    if (!chatLogId) {
      console.error('Error: Missing chatLogId in request body');
      return res.status(400).json({ error: 'chatLogId is required' });
    }

    try {
      console.log(`Generating summary for chatLogId: ${chatLogId}`);
      const summaryLog = await summaryService.createSummary(chatLogId);
      console.log('Summary created successfully:', summaryLog);
      res.json({ summaryLog });
    } catch (error) {
      console.error(`Error generating and saving summary for chatLogId ${chatLogId}:`, error);
      res.status(500).json({ error: 'Error generating and saving summary' });
    }
  }

  // 요약본 출력
  async getSummary(req, res) {
    const { summaryLogId } = req.params;

    if (!summaryLogId) {
      console.error('Error: Missing summaryLogId in request parameters');
      return res.status(400).json({ error: 'summaryLogId is required' });
    }

    try {
      console.log(`Retrieving summary for summaryLogId: ${summaryLogId}`);
      const summaryLog = await summaryService.getSummary(summaryLogId);
      if (!summaryLog) {
        console.warn(`No summary found for summaryLogId ${summaryLogId}`);
        return res.status(404).json({ message: 'Summary not found' });
      }
      console.log('Summary retrieved successfully:', summaryLog);
      res.json({ summaryLog });
    } catch (error) {
      console.error(`Error retrieving summary for summaryLogId ${summaryLogId}:`, error);
      res.status(500).json({ error: 'Error retrieving summary' });
    }
  }

  // 클라이언트에 업로드 URL을 제공
  async getUploadUrl(req, res) {
    const { fileName } = req.query;

    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    try {
      // UploadService를 통해 서명된 URL을 생성합니다.
      const url = await imageService.generateUploadUrl(fileName);
      res.json({ url });
    } catch (error) {
      console.error('Error generating upload URL:', error);
      res.status(500).json({ error: 'Error generating upload URL' });
    }
  }
}

module.exports = new SummaryController();