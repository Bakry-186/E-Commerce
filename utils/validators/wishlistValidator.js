import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";
import Product from "../../models/productModel.js";

export const productIdValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product ID format.")
    .custom(async (productId) => {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Invalid product ID.");

      return true;
    }),

  validatorMiddleware,
];
