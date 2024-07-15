const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient({
  credentials: {
    type: process.env.GCP_TYPE,
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GCP_CLIENT_EMAIL,
    client_id: process.env.GCP_CLIENT_ID,
    auth_uri: process.env.GCP_AUTH_URI,
    token_uri: process.env.GCP_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GCP_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GCP_UNIVERSE_DOMAIN
  }
});

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
