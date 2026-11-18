import mongoose from 'mongoose';
import Branch from '../models/branch.model.js';

export const connectDatabase = async () => {
  const environment = process.env.NODE_ENV || 'development';
  const connectionString = process.env.MONGODB_URI || (
    environment === 'development'
      ? process.env.DATABASE_DEVELOPMENT
      : process.env.DATABASE_PRODUCTION
  );

  if (!connectionString) {
    throw new Error(
      `Missing MongoDB connection string for ${environment}. Set MONGODB_URI or the matching DATABASE_* variable.`,
    );
  }

  try {
    const conn = await mongoose.connect(connectionString);
    const branchIndexes = await Branch.collection.indexes();
    const legacyUsernameIndex = branchIndexes.find((index) => index.name === 'username_1');
    if (legacyUsernameIndex) {
      await Branch.collection.dropIndex(legacyUsernameIndex.name);
      console.log('Removed legacy unique username index from branches');
    }
    console.log(`MongoDB Connected: ${conn.connection.host} (${environment})`);
    return conn;
  } catch (error) {
    const wrappedError = new Error(
      `MongoDB connection failed (${environment}): ${error.message}`,
      { cause: error },
    );
    throw wrappedError;
  }
};
