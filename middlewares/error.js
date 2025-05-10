import ApiError from "../utils/apiError.js";

// Send detailed error information in development environment
const sendErrorForDev = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    error,              // Full error object
    message: error.message,  // Error message
    stack: error.stack,      // Stack trace for debugging
  });
};

// Handle invalid JWT signature error
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please try again.", 401);

// Handle expired JWT token error
const handleJwtExpired = () =>
  new ApiError("Expired token, please try again.", 401);

// Send minimal error information in production environment
const sendErrorForProd = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message, // Hide stack trace for security
  });
};

// Global error handler middleware
const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 400;

  // In development mode: send full error info
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(error, res);
  } else {
    // In production mode: handle specific JWT errors
    if (error.name === "JsonWebTokenError") error = handleJwtInvalidSignature();
    if (error.name === "TokenExpiredError") error = handleJwtExpired();
    sendErrorForProd(error, res);
  }
};

export default globalError;
