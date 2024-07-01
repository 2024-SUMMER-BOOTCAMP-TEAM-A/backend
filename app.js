require('dotenv').config(); // dotenv 패키지 로드

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger-output.json');

const app = express();


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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
