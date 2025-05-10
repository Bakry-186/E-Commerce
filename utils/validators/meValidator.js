import { check } from "express-validator";
import bcrypt from "bcrypt";

import validatorMiddleware from "../../middlewares/validator.js";
import User from "../../models/userModel.js";

/**
 * @desc Validator for updating the user's profile (name, email, phone)
 * This allows users to update their profile data with validation checks
 */
export const updateMyProfileValidator = [
  check("name").optional().isString().withMessage("Name must be a string."),

  check("email").optional().isEmail().withMessage("Invalid email format."),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number."),

  validatorMiddleware, // Check for validation errors and send response if any
];

/**
 * @desc Validator for changing the user's password
 * Validates current password, new password, and password confirmation
 */
export const changeMyPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  check("password")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.user._id);

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) throw new Error("Incorrect current password.");

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
