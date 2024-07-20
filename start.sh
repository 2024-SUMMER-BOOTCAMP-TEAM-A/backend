#!/bin/sh

# 데이터베이스 마이그레이션 및 시드 실행
npx sequelize-cli db:migrate

# 서버 시작
npm start
