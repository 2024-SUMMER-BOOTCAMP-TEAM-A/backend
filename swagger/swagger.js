const swaggerAutogen = require('swagger-autogen')({ language: 'ko' });

const doc = {
  info: {
    title: "타이틀 입력",
    description: "설명 입력",
  },
  host: "8000",
  schemes: ["http"],
  // schemes: ["https" ,"http"],
};

const outputFile = "../swagger/swagger-output.json";	
const endpointsFiles = ["../app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../app'); // 서버 파일 실행
  });
