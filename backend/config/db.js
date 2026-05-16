import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const DB =
      process.env.NODE_ENV === 'development'
        ? process.env.DATABASE_DEV
        : process.env.DATABASE_PROD;

    const conn = await mongoose.connect(DB);
    console.log(
      `MongoDB Connected: ${conn.connection.host} (${process.env.NODE_ENV})`,
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
