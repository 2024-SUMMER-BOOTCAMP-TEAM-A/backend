require('dotenv').config();

module.exports = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiModel: 'gpt-4-turbo',
    clovaApiKey: process.env.CLOVA_API_KEY,
    clovaModel: 'clova-premium',
}