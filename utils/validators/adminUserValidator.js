import { check } from "express-validator";
import bcrypt from "bcrypt";

import validatorMiddleware from "../../middlewares/validator.js";
import User from "../../models/userModel.js";

/**
 * @desc Validator for creating a new user
 * Ensures required fields are present and valid
 */
export const createUserValidator = [
  check("name").notEmpty().withMessage("Name is required."),

  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required.")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error("Email already in use.");

      return true;
    }),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .notEmpty()
    .withMessage("Password is required.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct.");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  check("role")
    .optional()
    .isIn(["customer", "admin", "manager"])
    .withMessage("Invalid role."),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number."),

    check("addresses")
    .optional()
    .custom((addresses) => {
      if (addresses && !Array.isArray(addresses)) {
        throw new Error("Addresses must be an array.");
      }
      return true;
    }),
  

  validatorMiddleware, // Check for validation errors and send response if any
];

/**
 * @desc Validator for checking if :id param is a valid Mongo ID
 */
export const userIdValidator = [
  check("id").isMongoId().withMessage("Invalid user ID."),
  validatorMiddleware,
];

/**
 * @desc Validator for updating user data
 * All fields are optional but validated if provided
 */
export const updateUserValidator = [
  ...userIdValidator,

  check("name").optional(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error("Email already in use.");
      return true;
    }),

  check("role").optional().isIn(["customer", "admin", "manager"]),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number."),

  validatorMiddleware,
];

/**
 * @desc Validator for changing a user's password
 * Validates current password and checks confirmation
 */
export const changeUserPasswordValidator = [
  ...userIdValidator,

  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  check("password")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.params.id);

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

  validatorMiddleware,
];
