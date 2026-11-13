import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import { router as authRouter } from './routes/auth.routes.js';
import { router as adminRouter } from './routes/admin.routes.js';
import { router as branchRouter } from './routes/branch.routes.js';
import { globalErrorHandler } from './controllers/error.controller.js';

export const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/branches', branchRouter);

app.all('*splat', (req, res, next) => {
  next(new AppError(`Page not found`, 404));
});

app.use(globalErrorHandler);

export default app;
