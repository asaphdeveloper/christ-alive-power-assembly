import mongoose from 'mongoose';

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
