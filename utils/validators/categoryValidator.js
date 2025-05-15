import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validator.js";

export const categoryIdValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format."),

  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3 })
    .withMessage("Too short Category name.")
    .isLength({ max: 32 })
    .withMessage("Too long Category name.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

export const updateCategoryValidator = [
  ...categoryIdValidator,

  check("id").isMongoId().withMessage("Invalid Category id format."),

  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];
