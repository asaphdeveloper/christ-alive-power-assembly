import { rateLimit } from 'express-rate-limit';

const rateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests. Please try again later.',
  },
};

export const apiLimiter = rateLimit({
  ...rateLimitOptions,
  limit: 100,
  skip: (req) => req.path === '/resources/events',
});

export const loginLimiter = rateLimit({
  ...rateLimitOptions,
  limit: 10,
  skipSuccessfulRequests: true,
});

export const uploadLimiter = rateLimit({
  ...rateLimitOptions,
  limit: 20,
  message: {
    status: 'fail',
    message: 'Too many upload attempts. Please wait before trying again.',
  },
});
