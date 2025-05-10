import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";

/**
 * @desc Validation rules for creating a new address
 * Validates required fields and formats
 */
export const createAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Address alias is required.")
    .isString(),

  check("details")
    .notEmpty()
    .withMessage("Address details are required.")
    .isString(),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid Egyptian phone number."),

  check("city").notEmpty().withMessage("City is required.").isString(),

  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required.")
    .isPostalCode("any")
    .withMessage("Invalid postal code."),

  validatorMiddleware, // Runs the validation result check
];

/**
 * @desc Validation for addressId parameter in routes like GET or DELETE /addresses/:addressId
 */
export const addressIdValidator = [
  check("addressId").isMongoId().withMessage("Invalid address ID."),

  validatorMiddleware,
];

/**
 * @desc Validation rules for updating an address
 * All fields are optional, but if provided, must be valid
 */
export const updateAddressValidator = [
  ...addressIdValidator,

  check("alias").optional().isString().withMessage("Alias must be a string."),

  check("details")
    .optional()
    .isString()
    .withMessage("Details must be a string."),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid Egyptian phone number."),

  check("city").optional().isString().withMessage("City must be a string."),

  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid postal code."),

  validatorMiddleware,
];
