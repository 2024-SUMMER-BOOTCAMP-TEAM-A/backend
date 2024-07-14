const { ChatLog, SummaryLog } = require('../models/chatLogModel.js');
const OpenAIService = require('../service/openAiService'); // OpenAIService 불러오기
const ImageService = require('../service/imageService'); // ImageService 불러오기

// summaryService 인스턴스 생성
const openaiConfig = require('../config/openAiConfig');
const summaryPromptFilePath = require('../prompt/summaryPrompt.json'); // 요약 프롬프트
const imagePromprFilePath = require('../prompt/imagePrompt.json');
const openaiService = new OpenAIService(openaiConfig.summary, summaryPromptFilePath);
const imageService = new ImageService(openaiConfig.image, imagePromprFilePath);

class SummaryService {
  // 일지 생성 및 저장
  async createSummary(chatLogId) { // chatLogId 받아오기
    console.error(chatLogId);
    if (!chatLogId) {
      console.error('Error: chatLogId is required');
      throw new Error('chatLogId is required');
    }

    console.log(`Fetching ChatLog with id: ${chatLogId}`);
    // chatLogId로 ChatLog 객체 가져오기
    const chatLog = await ChatLog.findById(chatLogId);
    if (!chatLog) {
      console.error(`Error: ChatLog not found for id: ${chatLogId}`);
      throw new Error('ChatLog not found');
    }

    console.log(`Generating prompt for ChatLog with id: ${chatLogId}`);
    // 프롬프트 생성 및 이미지 생성
    const prompt = `Please summarize the following conversation:\n\n${chatLog.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}`;
    
    console.log('Generating image from prompt');
    const image = await imageService.generateAndUploadImage(prompt); // URL 반환
    console.log('Image generated successfully:', image);

    console.log('Generating summary from prompt');
    // 대화 내용 요약 및 결론 생성
    const summary = await openaiService.summarize(prompt); // 요약본 생성
    console.log('Summary generated successfully:', summary);

    console.log('Generating conclusion from summary');
    const conclusion = await openaiService.createConclusion(summary); // 결론 생성
    console.log('Conclusion generated successfully:', conclusion);

    console.log('Creating SummaryLog object');
    // SummaryLog 객체 생성 및 저장
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
    await summaryLog.save(); // 일지 저장
    console.log('SummaryLog saved successfully:', summaryLog);

    return summaryLog;
  }

  // 일지 출력
  async getSummary(summaryLogId) {
    if (!summaryLogId) {
      console.error('Error: summaryLogId is required');
      throw new Error('summaryLogId is required');
    }

    console.log(`Fetching SummaryLog with id: ${summaryLogId}`);
    // summaryLogId로 SummaryLog 객체 가져오기
    const summaryLog = await SummaryLog.findById(summaryLogId);
    if (!summaryLog) {
      console.error(`Error: SummaryLog not found for id: ${summaryLogId}`);
      throw new Error('SummaryLog not found');
    }

    console.log('SummaryLog fetched successfully:', summaryLog);
    return summaryLog;
  }
}

module.exports = new SummaryService();