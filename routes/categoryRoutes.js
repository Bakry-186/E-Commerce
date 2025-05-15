import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} from "../controllers/categoryCtrl.js";

import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators/categoryValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";
import subCategoryRouter from "./subCategoriesRoutes.js";

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRouter);

router
  .route("/")
  .get(getCategories)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(categoryIdValidator, getCategory)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    verifyToken,
    authorizeRoles("admin", "manager"),
    categoryIdValidator,
    deleteCategory
  );

export default router;
