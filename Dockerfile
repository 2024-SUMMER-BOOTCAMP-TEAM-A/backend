#이미지 빌드
FROM node:18-alpine
# 작업 디렉토리 설정
WORKDIR /backend

# package.json과 package-lock.json 파일을 /usr/src/app 디렉토리로 복사
COPY . /backend

# npm 패키지 설치
RUN npm install
RUN npm install -g nodemon

EXPOSE 8000

CMD ["npm", "start"]
# CMD ["nodemon", "-L", "app.js"]