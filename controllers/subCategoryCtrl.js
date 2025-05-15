import SubCategory from "../models/subCategoryModel.js";

import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/handlerFactory.js";

export const setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// @desc Get list of subCategories that belong to specific category
// GET /api/categories/:categoryId/subcategories
// @access Public

// @desc Create subCategories that belong to specific category
// POST /api/categories/:categoryId/subcategories
// @access Private/Admin-Manager

// @desc Get list of subCategories
// @route GET /api/v1/subcategories
// @access Public
export const getSubCategories = getAll(SubCategory);

// @desc Get specific subCategory by id
// @route GET /api/v1/subcategories/:id
// @access Public
export const getSubCategory = getOne(SubCategory);

// @desc Create subCategory
// @route POST /api/v1/subcategories
// @access Private/Admin-Manager
export const createSubCategory = createOne(SubCategory);

// @desc Update specific subCategory
// @route PUT /api/v1/subcategories/:id
// @access Private/Admin-Manager
export const updateSubCategory = updateOne(SubCategory);

// @desc Delete specific subCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private/Admin
export const deleteSubCategory = deleteOne(SubCategory);
