import { check } from "express-validator";
import mongoose from "mongoose";

import validatorMiddleware from "../../middlewares/validator.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/cartModel.js";

export const cartItemIdValidator = [
  check("itemId").isMongoId().withMessage("Invalid Cart item ID format."),

  validatorMiddleware,
];

export const createCartValidator = [
  check("product")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid product ID.")
    .custom(async (productId) => {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Invalid product ID.");

      return true;
    }),

  check("color")
    .optional()
    .isString()
    .withMessage("Color must be a string.")
    .custom(async (color, { req }) => {
      const product = await Product.findOne({
        _id: req.body.product,
        colors: color,
      });
      if (!product) throw new Error("Invalid product color.");

      return true;
    }),

  validatorMiddleware,
];

export const updateCartValidator = [
  ...cartItemIdValidator,

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number."),

  check("color")
    .optional()
    .isString()
    .withMessage("Color must be a string.")
    .custom(async (color, { req }) => {
      const product = await Product.findOne({
        _id: req.body.product,
        colors: color,
      });
      if (!product) throw new Error("Invalid product color.");

      return true;
    }),

  validatorMiddleware,
];
