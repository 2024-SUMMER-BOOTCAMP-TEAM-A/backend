const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

router.get('/', personController.getAllPersons); // 전체 조회
router.get('/:id', personController.getPersonById); // 부분 조회
router.get('/name/:id', personController.getNameByID); // id로 인격 이름 조회

module.exports = router;
