require('dotenv').config();
const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const openaiService = require('../service/openAiService');

const storage = new Storage({
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
  },
});

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const openai = require('../config/openAiConfig');

class ImageService {
  constructor(config) {
    this.config = config;
    this.openaiClient = new openaiService({ apiKey: this.config.apiKey }).openaiClient;
  }

  async generateAndUploadImage(prompt) {
    if (!prompt) {
      throw new Error('prompt is required');
    }

    try {
      console.log("Generating image...");
      const response = await this.openaiClient.images.generate({
        model: openai.image.model,
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0].url;
      console.log(`Image generated, fetching from URL: ${imageUrl}`);

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();

      console.log("Processing image...");
      const processedImageBuffer = await sharp(imageBuffer)
        .resize(1792, 1024)
        .webp({ quality: 70 })
        .toBuffer();

      const fileName = `${Date.now()}-generated-image.webp`;
      await storage.bucket(bucketName).file(fileName).save(processedImageBuffer);

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      console.log(`Generated and uploaded image for prompt: "${prompt}"`);
      console.log(`Image uploaded: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      console.error('Error generating or uploading image:', error);
      throw error;
    }
  }

  // JSON 파일 불러오는 함수 추가
  static loadPicturePrompt() {
    const picturePromptPath = path.join(__dirname, '..', 'prompt', 'picturePrompt.json');
    if (fs.existsSync(picturePromptPath)) {
      try {
        const picturePromptData = fs.readFileSync(picturePromptPath, 'utf8');
        return JSON.parse(picturePromptData);
      } catch (jsonError) {
        console.error('Error parsing picturePrompt.json:', jsonError);
      }
    } else {
      console.error('picturePrompt.json file does not exist at path:', picturePromptPath);
    }
    return null;
  }
}

module.exports = ImageService;
