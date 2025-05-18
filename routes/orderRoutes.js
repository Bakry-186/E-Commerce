import express from "express";

import {
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  createCheckoutSession,
} from "../controllers/orderCtrl.js";

import {
  shippingAddressValidator,
  orderIdValidator,
  updateStatusValidator,
} from "../utils/validators/orderValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";
import createFilterObj from "../middlewares/filter.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/:cartId",
  authorizeRoles("customer"),
  shippingAddressValidator,
  createCashOrder
);

router.post(
  "/checkout-session/:cartId",
  authorizeRoles("customer"),
  shippingAddressValidator,
  createCheckoutSession
);

router.get(
  "/",
  authorizeRoles("customer", "admin", "manager"),
  createFilterObj({ userField: true }),
  getOrders
);

router.get(
  "/:id",
  authorizeRoles("customer", "admin", "manager"),
  createFilterObj({ userField: true }),
  orderIdValidator,
  getOrder
);

router.put(
  "/:id/status",
  authorizeRoles("admin", "manager"),
  updateStatusValidator,
  updateOrderStatus
);

export default router;
