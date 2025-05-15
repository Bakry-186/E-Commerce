import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";
import Product from "../../models/productModel.js";
import Review from "../../models/reviewModel.js";

export const reviewIdValidator = [
  check("id").isMongoId().withMessage("Invalid review ID format."),
];

export const reviewOwnerValidator = [
  ...reviewIdValidator,

  check("id").custom(async (reviewId, { req }) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Invalid review ID.");

    if (!review.user) {
      throw new Error("Review user information is incomplete.");
    }

    if (
      req.user.role === "customer" &&
      review.user._id.toString() !== req.user._id.toString()
    ) {
      throw new Error("You can't perform this action.");
    }

    return true;
  }),

  validatorMiddleware,
];

export const createReviewValidator = [
  check("ratings")
    .notEmpty()
    .withMessage("Ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1.0 and 5.0"),

  check("title").optional().isString().withMessage("Title must be a string"),

  check("user")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),

  check("productId")
    .isMongoId()
    .withMessage("Invalid product ID format.")
    .notEmpty()
    .withMessage("Product ID is required.")
    .custom(async (productId) => {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Invalid product ID.");
    }),

  validatorMiddleware,
];

export const updateReviewValidator = [
  ...reviewOwnerValidator,

  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1.0 and 5.0"),

  check("title").optional().isString().withMessage("Title must be a string"),

  validatorMiddleware,
];
