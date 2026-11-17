import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';

dotenv.config({ path: './.env' });

const createGeneralOverseer = async () => {
  try {
    const environment = process.env.NODE_ENV || 'development';
    const connectionString = process.env.MONGODB_URI || (
      environment === 'production'
        ? process.env.DATABASE_PRODUCTION
        : process.env.DATABASE_DEVELOPMENT
    );
    if (!connectionString) {
      throw new Error(`Set MONGODB_URI or DATABASE_${environment === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'} in backend/.env.`);
    }

    const name = process.env.INITIAL_GENERAL_OVERSEER_NAME;
    const username = process.env.INITIAL_GENERAL_OVERSEER_USERNAME
      || process.env.INITIAL_GENERAL_OVERSEER_EMAIL;
    const password = process.env.INITIAL_GENERAL_OVERSEER_PASSWORD;
    if (!name || !username || !password) {
      throw new Error(
        'Set INITIAL_GENERAL_OVERSEER_NAME, INITIAL_GENERAL_OVERSEER_USERNAME (or INITIAL_GENERAL_OVERSEER_EMAIL), and INITIAL_GENERAL_OVERSEER_PASSWORD in backend/.env.',
      );
    }

    await mongoose.connect(connectionString);

    const legacyEmailIndex = (await Admin.collection.indexes()).find(
      (index) => index.key?.email === 1,
    );
    if (legacyEmailIndex) {
      await Admin.collection.dropIndex(legacyEmailIndex.name);
      console.log(`Removed obsolete admin index: ${legacyEmailIndex.name}.`);
    }

    if (await Admin.exists({ role: 'general-overseer' })) {
      console.log('A General Overseer account already exists.');
      return;
    }

    const normalizedUsername = username.trim().toLowerCase();
    if (await Admin.exists({ username: normalizedUsername })) {
      throw new Error('This username already belongs to another admin.');
    }

    await Admin.create({
      name: name.trim(),
      username: normalizedUsername,
      role: 'general-overseer',
      password,
    });

    console.log('General Overseer account created successfully.');
  } catch (error) {
    console.error('General Overseer creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  }
};

createGeneralOverseer();
