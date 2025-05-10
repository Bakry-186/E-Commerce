import { validationResult } from "express-validator";

// @desc Middleware to check for validation errors from express-validator
const validatorMiddleware = (req, res, next) => {
  // Collect the validation errors from the request
  const errors = validationResult(req);

  // If there are errors, return a 400 response with the errors array
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If no validation errors, proceed to the next middleware or route handler
  next();
};

export default validatorMiddleware;
