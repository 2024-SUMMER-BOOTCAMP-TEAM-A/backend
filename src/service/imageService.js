const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const openaiConfig = require('../config/openAiConfig');

const storage = new Storage();
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

class ImageService {
  constructor(openaiService) {
    this.openaiService = openaiService;
  }

  async generateImage(prompt) {
    if (!prompt) {
      throw new Error('prompt is required');
    }

    const response = await this.openaiService.openaiClient.images.create({
      prompt,
      n: 1,
      size: "1792x1024",
    });

    const imageUrl = response.data.data[0].url;
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    return imageBuffer;
  }

  async uploadImageToGCS(buffer, fileName) {
    const tempFilePath = path.join('/tmp', fileName);
    fs.writeFileSync(tempFilePath, buffer);

    await storage.bucket(bucketName).upload(tempFilePath, {
      destination: fileName,
    });

    fs.unlinkSync(tempFilePath);
    console.log(`Image uploaded to ${bucketName}/${fileName}`);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
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
}

module.exports = ImageService;
