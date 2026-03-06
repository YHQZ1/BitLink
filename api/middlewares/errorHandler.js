/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(statusCode).json({
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    message: "An unexpected error occurred. Please try again later.",
  });
};
