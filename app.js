require('dotenv').config(); // dotenv 패키지 로드

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger-output.json');
const app = express();
const db = require('./src/models');


/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome 메시지 반환
 *     responses:
 *       200:
 *         description: 성공
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 사람 전체 조회
app.get('/persons', async (req, res) => {
  const persons = await db.Person.findAll({ attributes: ['id', 'name'] });
  res.json(persons);
});

// 특정 사람 조회
app.get('/persons/:id', async (req, res) => {
  const person = await db.Person.findByPk(req.params.id, { attributes: ['name', 'content'] });
  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Person not found');
  }
});

// 서버 포트 설정
const PORT = 8000; // 포트 번호를 8000으로 명시

// 데이터베이스 동기화 후 서버 시작
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});