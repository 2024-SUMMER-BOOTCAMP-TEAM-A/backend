require('dotenv').config();

module.exports = {
    default: {
        clientId: process.env.CLOVA_CLIENT_ID,
        apiKeySecret: process.env.CLOVA_API_KEY,
        speaker: 'nara',
        volume: '0',
        speed: '0',
        alpha: '0',
        format: 'mp3',
    },
    lucky: {
        clientId: process.env.CLOVA_CLIENT_ID,
        apiKeySecret: process.env.CLOVA_API_KEY,
        speaker: 'vyuna',
        volume: '1',
        speed: '-2',
        alpha: '-3',
        emotion: '2',
        emotion_strength: '2',
        format: 'mp3',
    },
    simon: {
        clientId: process.env.CLOVA_CLIENT_ID,
        apiKeySecret: process.env.CLOVA_API_KEY,
        speaker: 'nsangdo',
        volume: '1',
        speed: '-3',
        alpha: '-5',
        format: 'mp3',
    },
    mz: {
        clientId: process.env.CLOVA_CLIENT_ID,
        apiKeySecret: process.env.CLOVA_API_KEY,
        speaker: 'nara',
        volume: '1',
        speed: '-2',
        alpha: '0',
        pitch: '-5',
        emotion: '2',
        emotion_strength: '2',
        format: 'mp3',
    },
    twentyQ: {
        clientId: process.env.CLOVA_CLIENT_ID,
        apiKeySecret: process.env.CLOVA_API_KEY,
        speaker: 'nmammon',
        volume: '1',
        speed: '-2',
        alpha: '-1',
        format: 'mp3',
    }
};
