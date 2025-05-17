import express from "express";

import {
  addProductToCart,
  getCart,
  deleteCart,
  updateCartItemQuantity,
  deleteItem,
  applyCoupon,
} from "../controllers/cartCtrl.js";

import {
  cartItemIdValidator,
  createCartValidator,
  updateCartValidator,
  applyCouponValidator,
} from "../utils/validators/cartValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("customer"));

router
  .route("/")
  .post(createCartValidator, addProductToCart)
  .get(getCart)
  .delete(deleteCart);

router.put("/apply-coupon", applyCouponValidator, applyCoupon);

router
  .route("/:itemId")
  .put(updateCartValidator, updateCartItemQuantity)
  .delete(cartItemIdValidator, deleteItem);

export default router;
