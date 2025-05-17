import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";
import Coupon from "../../models/couponModel.js";

export const couponIdValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format."),

  validatorMiddleware,
];

export const createCouponValidator = [
  check("code")
    .notEmpty()
    .withMessage("Coupon code is required.")
    .isString()
    .withMessage("Coupon code must be a string.")
    .trim()
    .custom(async (code) => {
      const coupon = await Coupon.findOne({ code });
      if (coupon) throw new Error("Coupon code must be unique.");

      return true;
    }),

  check("expire")
    .notEmpty()
    .withMessage("Coupon expire date is required.")
    .isISO8601()
    .withMessage("Expire must be a valid date."),

  check("discount")
    .notEmpty()
    .withMessage("Discount value is required.")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100."),

  validatorMiddleware,
];

export const updateCouponValidator = [
  ...couponIdValidator,

  check("code")
    .optional()
    .isString()
    .withMessage("Coupon code must be a string.")
    .trim()
    .custom(async (code) => {
      const coupon = await Coupon.findOne({ code });
      if (coupon) throw new Error("Coupon code must be unique.");

      return true;
    }),

  check("expire")
    .optional()
    .isISO8601()
    .withMessage("Expire must be a valid date."),

  check("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100."),

  validatorMiddleware,
];
