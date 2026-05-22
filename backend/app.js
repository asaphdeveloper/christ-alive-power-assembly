import express from 'express';
import morgan from 'morgan';
import AppError from './utils/AppError.js';
import { router as userRouter } from './routes/user.routes.js';
import { router as authRouter } from './routes/auth.routes.js';

export const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.all('*splat', (req, res, next) => {
  next(new AppError(`Page not found`, 404));
});

app.use((err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired! Please log in again!', 401);
  }

  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again!', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  res.status(statusCode).json({ status, message });

  next();
});

export default app;
