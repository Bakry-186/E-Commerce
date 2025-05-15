import slugify from "slugify";
import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";
import Brand from "../../models/brandModel.js";

// Validator for Get Product by ID
export const productIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid product ID format.")
    .notEmpty()
    .withMessage("Product ID is required."),

  validatorMiddleware,
];

// Validator for Create Product
export const createProductValidator = [
  check("title")
    .isString()
    .withMessage("Product title must be a string.")
    .notEmpty()
    .withMessage("Product title is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters.")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      return true;
    }),

  check("description")
    .isString()
    .withMessage("Product description must be a string.")
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Product description must be between 20 and 2000 characters."),

  check("quantity")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a non-negative integer.")
    .notEmpty()
    .withMessage("Product quantity is required."),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold quantity must be a non-negative integer."),

  check("price")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number.")
    .notEmpty()
    .withMessage("Product price is required.")
    .isLength({ max: 100000000 })
    .withMessage("Too long price"),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price after discount must be a positive number.")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings."),

  check("imageCover")
    .isString()
    .withMessage("Image cover must be a string.")
    .notEmpty()
    .withMessage("Image cover is required."),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings."),

  check("category")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .notEmpty()
    .withMessage("Category ID is required.")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Invalid category ID.");

      return true;
    }),

  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Sub categories must be an array of IDs.")
    .custom(async (subCategoriesIds) => {
      const subCategories = await SubCategory.find({
        _id: { $in: subCategoriesIds },
      });
      if (subCategories.length !== subCategoriesIds.length)
        throw new Error("Invalid sub categories IDs.");

      return true;
    })
    .custom(async (subCategoriesIds, { req }) => {
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });

      const checker = subCategoriesIds.every((subCategoryId) => {
        return subCategories.some(
          (sub) => sub._id.toString() === subCategoryId.toString()
        );
      });
      if (!checker)
        throw new Error("Sub categories doesn't belong to category.");

      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format.")
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) throw new Error("Invalid brand ID.");
    }),

  check("ratingsAvg")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Average rating must be between 1.0 and 5.0."),

  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a non-negative integer."),

  validatorMiddleware,
];

// Validator for Update Product
export const updateProductValidator = [
  ...productIdValidator,

  check("title")
    .optional()
    .isString()
    .withMessage("Product title must be a string.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters.")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      return true;
    }),

  check("description")
    .optional()
    .isString()
    .withMessage("Product description must be a string.")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters."),

  check("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a non-negative integer."),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold quantity must be a non-negative integer."),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number."),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price after discount must be a positive number.")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings."),

  check("imageCover")
    .optional()
    .isString()
    .withMessage("Image cover must be a string."),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings."),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Invalid category ID.");

      return true;
    }),

  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Sub categories must be an array of IDs.")
    .custom(async (subCategoriesIds) => {
      const subCategories = await SubCategory.find({
        _id: { $in: subCategoriesIds },
      });
      if (!subCategories) throw new Error("Invalid sub categories IDs.");

      return true;
    })
    .custom(async (subCategoriesIds, { req }) => {
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });

      const checker = subCategoriesIds.every((subCategoryId) =>
        subCategories.includes(subCategoryId)
      );
      if (!checker)
        throw new Error("Sub categories doesn't belong to category.");

      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format.")
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) throw new Error("Invalid brand ID.");
    }),

  check("ratingsAvg")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Average rating must be between 1.0 and 5.0."),

  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a non-negative integer."),

  validatorMiddleware,
];
