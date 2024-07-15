const handleStreamingSpeech = require('../controllers/speechController');

module.exports = function(io) {
  handleStreamingSpeech(io);
};
