const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();

function handleStreamingSpeech(io) {
  io.on('connection', (socket) => {
    console.log('Client connected');

    const recognizeStream = speechClient
      .streamingRecognize({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'ko-KR',
        },
        interimResults: false,
      })
      .on('data', (data) => {
        socket.emit('transcript', data.results[0].alternatives[0].transcript);
      })
      .on('error', (err) => {
        console.error('Error during streaming:', err);
      })
      .on('end', () => {
        console.log('Streaming ended');
      });

    socket.on('audio', (message) => {
      recognizeStream.write(message);
    });

    socket.on('disconnect', () => {
      recognizeStream.end();
      console.log('Client disconnected');
    });
  });
}

module.exports = handleStreamingSpeech;
