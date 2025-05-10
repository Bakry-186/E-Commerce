import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";
import User from "../../models/userModel.js";

/**
 * @desc Validator for user signup
 * Validates user name, email, password and its confirmation
 */
export const signupValidator = [
  check("name")
    .isString()
    .withMessage("User name must be a string.")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name must be between 2 and 32 characters."),

  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required.")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already in use.");
      }
      return true;
    }),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct.");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  validatorMiddleware, // Check for validation errors and send response if any
];

/**
 * @desc Validator for user login
 * Validates user email and password
 */
export const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required."),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  validatorMiddleware,
];

/**
 * @desc Validator for forgot password request
 * Validates the user's email
 */
export const forgotPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required."),

  validatorMiddleware,
];

/**
 * @desc Validator for reset password code
 * Ensures the reset code is numeric and exactly 6 digits
 */
export const resetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .isNumeric()
    .withMessage("Code must be numeric")
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be exactly 6 digits"),

  validatorMiddleware,
];

/**
 * @desc Validator for resetting the password
 * Validates email, new password and its confirmation
 */
export const resetPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required."),

  check("newPassword")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct!");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  validatorMiddleware,
];
