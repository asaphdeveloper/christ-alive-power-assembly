
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';

dotenv.config({ path: './.env' });

const createDeveloper = async () => {
  try {
    if (!process.env.DATABASE_DEVELOPMENT) {
      throw new Error(
        'DATABASE_DEVELOPMENT is missing from backend/.env (or set MONGODB_URI).',
      );
    }

    await mongoose.connect(process.env.DATABASE_DEVELOPMENT);

    // Prevent creating another developer if one already exists
    const existingDeveloper = await Admin.findOne({
      role: 'developer',
    });

    if (existingDeveloper) {
      console.log('A developer account already exists.');
      return;
    }

    const username = 'asaphdeveloper@gmail.com';

    const existingUsername = await Admin.findOne({ username });

    if (existingUsername) {
      throw new Error('This username already belongs to another admin.');
    }

    await Admin.create({
      name: 'Asaph',
      username,
      role: 'developer',
      password: 'developer@capa',
      passwordConfirm: 'developer@capa',
    });

    console.log('Developer account created successfully.');
  } catch (error) {
    console.error('Developer creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createDeveloper();
