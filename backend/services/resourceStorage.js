import { S3Client } from '@aws-sdk/client-s3';
import AppError from '../utils/appError.js';

let client;
export function isR2Configured() {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME);
}

export function getR2Client() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
  if (!isR2Configured()) {
    throw new AppError('Cloudflare R2 is not configured. Add the R2 credentials to the backend environment.', 503);
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    });
  }
  return client;
}

export function getResourceCategories() {
  return [
    { id: 'sunday-bulletin', title: 'Sunday Bulletin' },
    { id: 'wednesday-bulletin', title: 'Wednesday Bulletin' },
    { id: 'bible-study-guide', title: 'Bible Study Guide' },
    { id: 'friday-prayer-meeting', title: 'Friday Prayer Meeting' },
    { id: 'sunday-school-guide', title: 'Sunday School Guide' },
  ];
}
