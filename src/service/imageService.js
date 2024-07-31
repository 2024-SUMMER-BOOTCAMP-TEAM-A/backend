require('dotenv').config();
const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const openaiService = require('../service/openAiService');
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const openai = require('../config/openAiConfig');
const { OpenAI } = require('openai');

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



class ImageService {
  constructor(config, promptFilePath) {
    this.config = config;
    this.promptFilePath = path.resolve(__dirname, promptFilePath);
    this.openaiClient = new OpenAI({ apiKey: config.apiKey });
  }

  async generateAndUploadImage(summary) {
    console.log('Current working directory:', process.cwd());
    console.log('Resolved prompt file path:', this.promptFilePath);
    const picturePrompt = await fs.readFile(this.promptFilePath, 'utf8');
    if (!picturePrompt) {
      throw new Error('Valid picturePrompt is required');
    }
    console.log(picturePrompt);
    const prompt = `When generating an image, be sure to observe the following conditions: Do not add text to the image. I want an illustration image, not containing text. ${picturePrompt}, ${summary}`;
    console.log('제발 프롬프팅 잘좀 해봐 :', prompt);
    try {
      console.log("Generating image...");
      const response = await this.openaiClient.images.generate({
        model : openai.image.model,
        prompt : prompt,
        n: 1,
        quality: "standard",
        size: "1792x1024",
      });
      if (!response.data || response.data.length === 0) {
        throw new Error('No image URL returned from OpenAI');
      }

      const imageUrl = response.data[0].url;
      console.log(`Image generated, fetching from URL: ${imageUrl}`);

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();

      const processedImageBuffer = await sharp(imageBuffer)
        .resize(896, 512)
        .webp({ quality: 70 })
        .toBuffer();

      const fileName = `${Date.now()}-generated-image.webp`;
      await storage.bucket(bucketName).file(fileName).save(processedImageBuffer);

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      console.log(`Image uploaded: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      console.error('Error generating or uploading image:', error.message);
      throw error;
    }
  }
}

module.exports = ImageService;
