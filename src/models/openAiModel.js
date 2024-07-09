const openaiConfig = require('../config/openAiConfig');
const OpenAIService = require('../service/openaiService');
const path = require('path');

// 각 인격에 대한 OpenAIService 인스턴스 생성
const defaultService = new OpenAIService(openaiConfig.default, path.join(__dirname, '../prompts/defaultPrompt.json'));
const luckyService = new OpenAIService(openaiConfig.lucky, path.join(__dirname, '../prompts/luckyPrompt.json'));
const simonService = new OpenAIService(openaiConfig.simon, path.join(__dirname, '../prompts/simonPrompt.json'));
const mzService = new OpenAIService(openaiConfig.mz, path.join(__dirname, '../prompts/mzPrompt.json'));
const twentyQService = new OpenAIService(openaiConfig.twentyQ, path.join(__dirname, '../prompts/twentyQPrompt.json'));
const summaryService = new OpenAIService(openaiConfig.summary, path.join(__dirname, '../prompts/summaryPrompt.json'));

module.exports = {
  defaultService,
  luckyService,
  simonService,
  mzService,
  twentyQService,
  summaryService,
};
