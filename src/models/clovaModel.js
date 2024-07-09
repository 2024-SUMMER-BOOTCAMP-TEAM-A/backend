const clovaConfig = require('../config/clovaConfig');
const ClovaTtsService = require('../service/clovaService');

// 각 인격에 대한 ClovaTtsService 인스턴스 생성
const defaultService = new ClovaTtsService(clovaConfig.default);
const luckyService = new ClovaTtsService(clovaConfig.lucky);
const simonService = new ClovaTtsService(clovaConfig.simon);
const mzService = new ClovaTtsService(clovaConfig.mz);
const twentyQService = new ClovaTtsService(clovaConfig.twentyQ);

module.exports = {
  defaultService,
  luckyService,
  simonService,
  mzService,
  twentyQService,
};
