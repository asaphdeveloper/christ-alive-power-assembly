import express from 'express';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import { router as userRouter } from './routes/user.routes.js';
import { router as authRouter } from './routes/auth.routes.js';
import { globalErrorHandler } from './controllers/error.controller.js';

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

app.use(globalErrorHandler);

export default app;
