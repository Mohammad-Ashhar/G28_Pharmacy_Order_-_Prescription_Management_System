import { Storage } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'pharmacy-prescriptions');

// Initialize Google Vision API
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export const uploadToGCS = async (file, folder = 'prescriptions') => {
  try {
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);
    
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype
      }
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error uploading to GCS:', error);
    throw error;
  }
};

export const extractTextFromImage = async (imageUrl) => {
  try {
    const [result] = await visionClient.textDetection(imageUrl);
    const detections = result.textAnnotations;
    
    if (detections && detections.length > 0) {
      return detections[0].description;
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
};

export const analyzeDocument = async (imageUrl) => {
  try {
    const [result] = await visionClient.documentTextDetection(imageUrl);
    const fullText = result.fullTextAnnotation;
    
    if (fullText) {
      return fullText.text;
    }
    
    return '';
  } catch (error) {
    console.error('Error analyzing document:', error);
    return '';
  }
};
