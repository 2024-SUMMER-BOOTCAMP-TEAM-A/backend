require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
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
const bucketName2 = process.env.GCLOUD_STORAGE_BUCKET2

const openai = require('../config/openAiConfig');
const imagePromprFilePath = require('../prompt/imagePrompt.json');


class ImageService {
  constructor() {
    this.config = openai.image;
    this.path = imagePromprFilePath;
    this.openaiClient = new openaiService({ apiKey: config.apiKey }).openaiClient;
  }

  async generateImage(prompt) {
    if (!prompt) {
      throw new Error('prompt is required');
    }

    const response = await this.openaiClient.images.generate({
      model: openai.image.model,
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    return imageBuffer;
  }

  async uploadImageToGCS(buffer, fileName) {
    await storage.bucket(bucketName).file(fileName).save(buffer);

    console.log(`Image uploaded to ${bucketName}/${fileName}`);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    console.log(`Image uploaded : ${publicUrl}`);

    return publicUrl;
  }

  async generateAndUploadImage(prompt) {
    try {
      const imageBuffer = await this.generateImage(prompt);
      const fileName = `${Date.now()}-generated-image.png`;

      const publicUrl = await this.uploadImageToGCS(imageBuffer, fileName);

      console.log(`Generated and uploaded image for prompt: "${prompt}"`);
      return publicUrl;
    } catch (error) {
      console.error('Error generating or uploading image:', error);
      throw error;
    }
  }

  async generateUploadUrl(fileName) {
    if (!fileName) {
      throw new Error('fileName is required');
    }

    try {
      const file = bucket.file(`logs/${fileName}`);
      
      // 서명된 URL 생성
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        contentType: 'image/png',
        expires: Date.now() + 15 * 60 * 1000, // 15분 동안 유효한 URL
      });

      return url;
    } catch (error) {
      console.error('Error generating upload URL:', error);
      throw error;
    }
  }
}

module.exports = new ImageService();
