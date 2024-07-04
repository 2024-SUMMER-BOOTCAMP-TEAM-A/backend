require('dotenv').config(); // dotenv 패키지 로드: 환경 변수 파일(.env)을 로드하여 프로세스 환경 변수로 설정

const express = require('express'); // express 패키지 로드
const userRoutes = require('./src/routes/userRoutes');
const swaggerUi = require('swagger-ui-express'); // swagger-ui-express 패키지 로드
const swaggerDocument = require('./swagger/swagger-output.json'); // Swagger 설정 파일 로드
const mongoose = require('mongoose'); // mongoose 패키지 로드
const { createClient } = require('redis'); // 최신 redis 클라이언트 로드
const { Sequelize } = require('sequelize'); // Sequelize 패키지 로드
const app = express(); // express 애플리케이션 생성
const db = require('./src/models'); // 데이터베이스 모델 로드

app.use(express.json());  // Middleware 설정 

// const mongoURI = process.env.MONGO_LOCAL_URL; // 로컬로 실행시
const mongoURI = process.env.MONGO_DOCKER_URL; // 도커로 실행시 


// MongoDB 연결 설정 함수
async function connectMongoDB() {
  while (true) {
    try {
      await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected...');
      break;
    } catch (err) {
      console.log('MongoDB connection error:', err);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 후 재시도
    }
  }
}

// Redis 클라이언트 설정 함수
const redisClient = createClient({
  // url: 'redis://localhost:6379' // 로컬로 실행시
  url: 'redis://redis:6379' // 노드 서버를 Docker Compose로 빌드할 경우
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
  while (true) {
    try {
      await redisClient.connect();
      console.log('Redis client connected...');
      break;
    } catch (err) {
      console.log('Redis connection error:', err);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 후 재시도
    }
  }
}

// Sequelize 연결 설정 함수
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: 'db',// 도커로 실행시
  // host: 'localhost', // 로컬로 실행시
  dialect: 'mysql',
});

async function connectSequelize() {
  while (true) {
    try {
      await sequelize.authenticate();
      console.log('MySQL connected...');
      break;
    } catch (err) {
      console.log('MySQL connection error:', err);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 후 재시도
    }
  }
}

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

/**
 * @swagger
 * /cache:
 *   get:
 *     summary: Redis 캐시 테스트
 *     responses:
 *       200:
 *         description: 성공
 */
app.get('/cache', async (req, res) => {
  const key = 'test_key';
  const value = 'test_value';

  try {
    // Redis에 데이터 설정
    await redisClient.set(key, value);
    
    // Redis에서 데이터 가져오기
    const reply = await redisClient.get(key);
    
    res.status(200).send(`Redis value: ${reply}`);
  } catch (err) {
    res.status(500).send('Redis error');
  }
});


// 라우트  설정 
app.use('/users', userRoutes);

// 서버 포트 설정
const PORT = 8000; // 포트 번호를 8000으로 명시

// 데이터베이스 동기화 후 서버 시작
(async () => {
  await connectMongoDB();
  await connectRedis();
  await connectSequelize();

  db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
})();


//사람조회
const personRoutes = require('./src/routes/personRoutes');
app.use('/persons', personRoutes);
