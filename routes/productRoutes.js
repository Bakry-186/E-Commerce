import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from "../controllers/productCtrl.js";

import {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
} from "../utils/validators/productValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(getProducts)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(productIdValidator, getProduct)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    productIdValidator,
    deleteProduct
  );

export default router;
