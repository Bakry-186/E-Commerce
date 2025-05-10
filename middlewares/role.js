import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";

// Middleware to restrict access to specific roles
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // Check if the logged-in user's role is allowed
    if (!roles.includes(req.user.role)) {
      // If not allowed, throw a 403 Forbidden error
      return next(new ApiError("Access denied.", 403));
    }

    // If allowed, continue to the next middleware or route handler
    next();
  });

export default authorizeRoles;
