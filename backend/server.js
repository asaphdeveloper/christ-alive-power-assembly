import app from './app.js';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

dotenv.config({ path: './config.env' });

const startServer = async () => {
  try {
    await connectDatabase();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(
        `Server is listening on port ${PORT} (${process.env.NODE_ENV})`,
      );
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
