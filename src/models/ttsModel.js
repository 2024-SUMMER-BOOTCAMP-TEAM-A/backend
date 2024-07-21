require('dotenv').config();

const XI_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!XI_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const elevenLabsServices = {
  lucky: "SVYiBDZxdMa07D9wrXTI",
  simon: "dMy7ZqZG0ehY6b8R8H5w",
  mz: "NDURYaJVTtj7evLbWdlD",
  twentyQ: "TalgtYyrOpJctkyIXo3W",
};

const personaToModel = {
  '침착맨': 'twentyQ',
  '장원영': 'lucky',
  '쌈디': 'simon',
  '맑눈광': 'mz'
};

const ttsSettings = {
  lucky: {
    stability: 0.4,
    similarity_boost: 1.0,
    style: 0.0,
    use_speaker_boost: false
  },
  simon: {
    stability: 0.5,
    similarity_boost: 1.0,
    style: 0.0,
    use_speaker_boost: false
  },
  mz: {
    stability: 0.5,
    similarity_boost: 1.0,
    style: 0.0,
    use_speaker_boost: false
  },
  twentyQ: {
    stability: 0.5,
    similarity_boost: 1.0,
    style: 0.0,
    use_speaker_boost: false
  }
};

const getVoiceId = (persona) => {
  const model = personaToModel[persona];
  return elevenLabsServices[model];
};

const getTTSSettings = (persona) => {
  const model = personaToModel[persona];
  return ttsSettings[model];
};

module.exports = {
  XI_API_KEY,
  getVoiceId,
  getTTSSettings
};
