const userSelectionService = require('../service/userSelectionService');
const userController = require('../controllers/userController');
const { Person, UserSelection } = require('../models'); // Sequelize 모델(MySQL)
const { ChatLog } = require('../models/chatLogModel'); // MongoDB 모델

async function saveUserSelection(req, res) {
  const { personId } = req.body;
  try {
    const userId = await userController.getUserId(req);

    // userSelectionService를 사용하여 저장
    await userSelectionService.createSelection(userId, personId);

    res.status(201).json({ message: 'UserSelection created successfully' });
  } catch (error) {
    console.error('Error saving userSelection:', error);
    res.status(500).json({ error: error.message });
  }
}

async function createChatLog(req, res) {
  try {
    console.log('Starting createChatLog...');

    const userId = await userController.getUserId(req);
    const nickname = await userController.getNickname(userId);

    const userSelection = await UserSelection.findOne({
      where: { user_id: userId },
      include: [{ model: Person, attributes: ['name'] }],
      order: [['selected_at', 'DESC']]
    });

    if (!userSelection) {
      console.log('UserSelection not found');
      return res.status(404).json({ message: 'UserSelection not found' });
    }

    const { name: persona } = userSelection.Person;
    console.log('Retrieved persona name:', persona);

    const chatLog = new ChatLog({ userName: nickname, persona, messages: [] });
    await chatLog.save();
    console.log('Chat log saved successfully:', chatLog);

    res.status(201).json({ message: 'Chat log saved successfully', chatLog, persona });
  } catch (error) {
    console.error('Error saving user selection to MongoDB:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

  
module.exports = {
  saveUserSelection,
  createChatLog
};
