require('dotenv').config();

module.exports = {
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4-turbo'
    },
    clova: {
        clientId: process.env.CLOVA_CLIENT_ID,
        apiKeySecret: process.env.CLOVA_API_KEY_SECRET
    }
};
