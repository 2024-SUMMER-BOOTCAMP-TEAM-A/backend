const express = require('express');
const router = express.Router();
const userSelectionController = require('../controllers/userSelectionController');

router.post('/', userSelectionController.saveUserSelection);
router.post('/chatLogs', userSelectionController.createChatLog);

module.exports = router;
