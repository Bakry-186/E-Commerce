import express from "express";

import {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} from "../controllers/brandCtrl.js";

import {
  brandIdValidator,
  createBrandValidator,
  updateBrandValidator,
} from "../utils/validators/brandValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(brandIdValidator, getBrand)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    verifyToken,
    authorizeRoles("admin", "manager"),
    brandIdValidator,
    deleteBrand
  );

export default router;
