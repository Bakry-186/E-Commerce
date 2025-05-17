import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.js";
import Cart from "../../models/cartModel.js";
import Order from "../../models/orderModel.js"

const cartIdValidator = [
  check("cartId")
    .isMongoId()
    .withMessage("Invalid cart ID format.")
    .custom(async (cartId) => {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Invalid cart ID.");

      return true;
    }),

  validatorMiddleware,
];

export const orderIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid order ID format.")
    .custom(async (orderId) => {
      const order = await Order.findById(orderId);
      if (!order) throw new Error("Invalid order ID.");

      return true;
    }),

  validatorMiddleware,
]

export const shippingAddressValidator = [
  ...cartIdValidator,

  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Address details are required.")
    .isString()
    .withMessage("Address details must be a string.")
    .trim(),

  check("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number."),

  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required.")
    .isString()
    .withMessage("City must be a string.")
    .trim(),

  check("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required.")
    .isPostalCode("any")
    .withMessage("Invalid postal code."),

  validatorMiddleware,
];

export const updateStatusValidator = [
  ...orderIdValidator,
  
  check("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Processing", "Shipped", "Out for Delivery", "Delivered"])
    .withMessage("Invalid status value"),
  validatorMiddleware,
];
