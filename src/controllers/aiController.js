const langchainClient = require('../langchains/langchainClient');

class AIController {
  // 대화 생성
  async chat(req, res) {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
      const response = await OpenAIModel.chat(userMessage);
      res.json({ response });
    } catch (error) {
      console.error('Error generating chat response:', error);
      res.status(500).json({ error: 'Error generating chat response' });
    }
  }

//   // 대화 요약
//   async summarize(req, res) {
//     const { conversationHistory } = req.body;

//     if (!conversationHistory || !conversationHistory.length) {
//       return res.status(400).json({ error: 'conversationHistory is required' });
//     }

//     try {
//       const summary = await langchainClient.generateSummary(conversationHistory);
//       res.json({ summary });
//     } catch (error) {
//       console.error('Error generating summary:', error);
//       res.status(500).json({ error: 'Error generating summary' });
//     }
//   }

  // 대화 초기화
  async resetChat(req, res) {
    try {
      OpenAIModel.resetChat();  // 대화 상태를 초기화합니다.
      res.status(200).json({ message: 'Chat session reset successfully' });
    } catch (error) {
      console.error('Error resetting chat session:', error);
      res.status(500).json({ error: 'Error resetting chat session' });
    }
  }

//   //tts
}

module.exports = new AIController();