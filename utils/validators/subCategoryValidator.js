import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validator.js";
import Category from "../../models/categoryModel.js";

export const subCategoryIdValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format."),

  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required.")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name.")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .notEmpty()
    .withMessage("Category ID is required.")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Invalid category ID");

      return true;
    }),

  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  ...subCategoryIdValidator,

  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .optional()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Invalid category ID");

      return true;
    }),

  validatorMiddleware,
];
