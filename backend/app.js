import express from 'express';
import morgan from 'morgan';
import AppError from './utils/AppError.js';
import { router as userRouter } from './routes/user.routes.js';

export const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/users', userRouter);

app.all('*splat', (req, res, next) => {
  next(new AppError(`Page not found`, 404));
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  res.status(statusCode).json({ status, message });
  next();
});

export default app;
