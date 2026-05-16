import express from 'express';
import morgan from 'morgan';
import { router as userRouter } from './routes/user.routes.js';

export const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/users', userRouter);

export default app;
