import express from "express";

import {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryCtrl.js";

import {
  subCategoryIdValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/subCategoryValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";
import createFilterObj from "../middlewares/filter.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj({ categoryParam: true }), getSubCategories)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    createFilterObj({ categoryParam: true }),
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(subCategoryIdValidator, getSubCategory)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    subCategoryIdValidator,
    deleteSubCategory
  );

export default router;
