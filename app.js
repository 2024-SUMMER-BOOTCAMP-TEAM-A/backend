require('dotenv').config(); // dotenv 패키지 로드: 환경 변수 파일(.env)을 로드하여 프로세스 환경 변수로 설정

const express = require('express'); // express 패키지 로드
const swaggerUi = require('swagger-ui-express'); // swagger-ui-express 패키지 로드
const swaggerDocument = require('./swagger/swagger-output.json'); // Swagger 설정 파일 로드
const mongoose = require('mongoose'); // mongoose 패키지 로드
const { createClient } = require('redis'); // 최신 redis 클라이언트 로드
const { Sequelize } = require('sequelize'); // Sequelize 패키지 로드
const db = require('./src/models'); // 데이터베이스 모델 로드
const cors = require('cors'); // cors 패키지 로드
const http = require('http'); // http 패키지 로드
const path = require('path'); // path 패키지 로드
const multer = require('multer'); // multer 패키지 로드

const app = express(); // express 애플리케이션 생성

// Multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 파일이 저장될 경로
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // 파일 확장자
    const filename = `${Date.now()}${ext}`;  // 파일 이름 생성
    cb(null, filename);  // 생성된 파일 이름으로 저장
  }
});

// Multer 설정
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 최대 파일 크기 (5MB)
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Socket.io 설정
const server = http.createServer(app); // http 서버 생성
const Socket = require('socket.io'); // socket.io 패키지 로드
const io = Socket(server); // socket.io 서버 생성
const handleStreamingSpeech = require('./src/socket/speechSocket'); // STT WebSocket 설정 로드
const chatSocket = require('./src/socket/chat'); 

app.use(cors()); // CORS 미들웨어 추가
app.use(express.json());  // Middleware 설정 

const mongoURI = process.env.MONGO_LOCAL_URL; // 로컬로 실행시
// const mongoURI = process.env.MONGO_DOCKER_URL; // 도커로 실행시 

// MongoDB 연결 설정 함수
async function connectMongoDB() {
  while (true) {
    try {
      await mongoose.connect(mongoURI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin',
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD
      }
      );
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
  url: 'redis://localhost:6379' // 로컬로 실행시
  // url: 'redis://redis:6379' // 노드 서버를 Docker Compose로 빌드할 경우
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
  // host: 'db',// 도커로 실행시
  host: 'localhost', // 로컬로 실행시
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

// 서버 포트 설정
const PORT = 8000; // 포트 번호를 8000으로 명시

// 데이터베이스 동기화 후 서버 시작
(async () => {
  console.log(mongoURI);
  await connectMongoDB();
  await connectRedis();
  await connectSequelize();

  db.sequelize.sync().then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
})();

// 기본 경로 설정
const apiPrefix = '/api/v1';

const personRoutes = require('./src/routes/personRoutes');
const userRoutes = require('./src/routes/userRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const summaryRoutes = require('./src/routes/summaryRoutes');
const userSelectionRoutes = require('./src/routes/userSelectionRoutes');


// 라우트 설정
app.use(`${apiPrefix}/persons`, personRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`/ai`, aiRoutes);
app.use(`${apiPrefix}/logs`, summaryRoutes);
app.use(`${apiPrefix}/userSelections`, userSelectionRoutes);

// Multer를 사용하는 파일 업로드 라우트
app.post(`${apiPrefix}/logs/upload`, upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ success: true, url: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});

// 스웨거 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// index.html 파일을 제공하기 위한 설정
app.use(express.static(path.join(__dirname, '.'))); // 현재 디렉토리의 루트 폴더를 정적 파일로 설정

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket을 사용한 실시간 STT 기능 추가
handleStreamingSpeech(io);

// 채팅 관련 WebSocket 설정 추가
chatSocket(io, redisClient);