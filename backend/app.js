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
const allowedOrigins = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));
app.use((req, res, next) => {
  req.cookies = Object.fromEntries(
    (req.headers.cookie || '').split(';').filter(Boolean).map((part) => {
      const separator = part.indexOf('=');
      const name = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      try {
        return [name, decodeURIComponent(value)];
      } catch {
        return [name, value];
      }
    }),
  );
  next();
});
app.use(express.json({ limit: '64kb' }));
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
