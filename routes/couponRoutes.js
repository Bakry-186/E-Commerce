import express from "express";

import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponCtrl.js";

import {
  couponIdValidator,
  createCouponValidator,
  updateCouponValidator,
} from "../utils/validators/couponValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("admin", "manager"));

router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);

router
  .route("/:id")
  .get(couponIdValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(couponIdValidator, deleteCoupon);

export default router;
