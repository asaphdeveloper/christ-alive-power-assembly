import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';

dotenv.config({ path: './.env' });

const createHeadquaterMediaAdmin = async () => {
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

    const { INITIAL_HEADQUATER_ADMIN_NAME, INITIAL_HEADQUATER_ADMIN_USERNAME, INITIAL_HEADQUATER_ADMIN_PASSWORD } = process.env;
    if (!INITIAL_HEADQUATER_ADMIN_NAME || !INITIAL_HEADQUATER_ADMIN_USERNAME || !INITIAL_HEADQUATER_ADMIN_PASSWORD) {
      throw new Error(
        'Set INITIAL_HEADQUATER_ADMIN_NAME, INITIAL_HEADQUATER_ADMIN_USERNAME, and INITIAL_HEADQUATER_ADMIN_PASSWORD in backend/.env.',
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

    const existingAdmin = await Admin.findOne({ role: 'headquater-media-admin' });
    if (existingAdmin) {
      console.log('A Headquater Media Admin account already exists.');
      return;
    }

    const username = INITIAL_HEADQUATER_ADMIN_USERNAME.trim().toLowerCase();
    if (await Admin.exists({ username })) {
      throw new Error('This email already belongs to another admin.');
    }

    await Admin.create({
      name: INITIAL_HEADQUATER_ADMIN_NAME.trim(),
      username,
      role: 'headquater-media-admin',
      password: INITIAL_HEADQUATER_ADMIN_PASSWORD,
    });

    console.log('Headquater Media Admin account created successfully.');
  } catch (error) {
    console.error('Headquater Media Admin creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  }
};

createHeadquaterMediaAdmin();
