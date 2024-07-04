const swaggerAutogen = require('swagger-autogen')({ language: 'ko' });

const doc = {
  info: {
    title: "PersonA API",
    description: "2024-SUMMER-BOOTCAMP-TEAM-A",
  },
  host: "localhost:8000",
  schemes: ["http"],
  tags: [
    {
      name: "person",
      description: "Person 관련 API"
    },
    {
      name: "user",
      description: "User 관련 API"
    },
    {
      name: "test",
      description: "테스트 API"
    }
  ],
};

const outputFile = '../swagger/swagger-output.json';	
const endpointsFiles = ['../app.js']; // 메인 파일을 지정

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../app'); // 서버 파일 실행
});
