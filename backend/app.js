import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import { router as authRouter } from './routes/auth.routes.js';
import { router as adminRouter } from './routes/admin.routes.js';
import { router as branchRouter } from './routes/branch.routes.js';
import { router as resourceRouter } from './routes/resource.routes.js';
import { globalErrorHandler } from './controllers/error.controller.js';
import { apiLimiter } from './middleware/rateLimiters.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
const hppMiddleware = hpp();
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: req.query,
  });
  hppMiddleware(req, res, next);
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/branches', branchRouter);
app.use('/api/resources', resourceRouter);

app.all('*splat', (req, res, next) => {
  next(new AppError(`Page not found`, 404));
});

app.use(globalErrorHandler);

export default app;
