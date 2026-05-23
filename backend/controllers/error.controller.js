import AppError from '../utils/AppError.js';

export const globalErrorHandler = (error, req, res, next) => {
  let err = error;

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired! Please log in again!', 401);
  }

  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again!', 401);
  }

  const statusCode = err.statusCode || 500;
  const status = statusCode.toString().startsWith('4') ? 'fail' : 'error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status: status,
      error: err,
      stack: err.stack,
      message: err.message,
    });
  } else if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      return res.status(statusCode).json({
        status: status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};
