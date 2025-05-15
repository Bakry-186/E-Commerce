import express from "express";

import {
  addProductToWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishlist
} from "../controllers/wishlistCtrl.js";

import {
  productIdValidator
} from "../utils/validators/wishlistValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("customer"));

router
  .route("/")
  .post(productIdValidator, addProductToWishlist)
  .get(getLoggedUserWishlist);

router
  .route("/:productId")
  .delete(productIdValidator, deleteProductFromWishlist);

export default router;
