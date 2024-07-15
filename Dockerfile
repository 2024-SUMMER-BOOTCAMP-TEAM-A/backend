# Node.js 18-alpine 이미지 사용
FROM node:18-alpine

# bash 설치
RUN apk add --no-cache bash

# 작업 디렉토리 설정
WORKDIR /backend

# package.json과 package-lock.json 파일을 작업 디렉토리로 복사
COPY package*.json ./

# npm 패키지 설치
RUN npm install

# 나머지 소스 파일을 작업 디렉토리로 복사
COPY . .

# Google Cloud 인증 파일 복사
COPY credentials.json /backend/credentials.json

# wait-for-it.sh에 실행 권한 부여
RUN chmod +x /backend/wait-for-it.sh /backend/start.sh

# 환경 변수 설정
ENV GOOGLE_APPLICATION_CREDENTIALS=/backend/credentials.json

# 데이터베이스가 준비될 때까지 대기한 후 마이그레이션 및 시딩 실행
CMD ["./wait-for-it.sh", "db:3306", "--", "/backend/start.sh"]
