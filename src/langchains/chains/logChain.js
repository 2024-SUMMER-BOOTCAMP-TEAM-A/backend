require('dotenv').config();
const LangChainClient = require('../langchainClient')
const ChatLog = require('../../models/chatLog');
const SummaryLog = require('../../models/summaryLog');

class LogChain {
  //일지 생성 및 저장
  async createSummary(chatLogId) {
    if (!chatLogId) {
      throw new Error('chatLogId is required');
    }

    const chatLog = await ChatLog.findById(chatLogId);
    if (!chatLog) {
      throw new Error('Chat log not found');
    }

    const summary = await OpenAIModel.summarize(conversationHistory); //요약본 생성

    const summaryLog = new SummaryLog({
      chatLogId: chatLogId,
      summary: summary,
      situation: situation,
      conclusion: conclusion,
      createdAt: new Date(),
    }); //일지 생성
    await summaryLog.save(); //일지 저장

    return summaryLog;
  }

  //요약본 출력
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

module.exports = new LogChain();
