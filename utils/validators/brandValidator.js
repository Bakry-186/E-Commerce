import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validator.js";

export const brandIdValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format."),

  validatorMiddleware,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required.")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name.")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

export const updateBrandValidator = [
  ...brandIdValidator,

  check("id").isMongoId().withMessage("Invalid Brand id format."),

  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];
