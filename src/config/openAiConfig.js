require('dotenv').config();

module.exports = {
    default: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4-turbo',
        maxTokens: 4096,
        temperature: 0.7,
    },
    lucky: {
        model: 'gpt-4-turbo',
        maxTokens: 4096,
        temperature: 0.7,
    },
    simon: {
        model: 'gpt-4-turbo',
        maxTokens: 4096,
        temperature: 0.6,
    },
    mz: {
        model: 'gpt-4-turbo',
        maxTokens: 4096,
        temperature: 0.8,
    },
    twentyQ: {
        model: 'gpt-4-turbo',
        maxTokens: 4096,
        temperature: 0.9,
    },
    summary: {
        model: 'gpt-4-turbo',
        maxTokens: 4096,
        temperature: 0.9,
    },
    image: {
        model: 'dall-e-2',
        maxTokens: 4096,
        temperature: 0.8,
    }
};
