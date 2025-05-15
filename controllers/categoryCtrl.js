import asyncHandler from "express-async-handler";
import { v4 as uudiv4 } from "uuid";
import sharp from "sharp";

import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/handlerFactory.js";

import { uploadSingleImage } from "../middlewares/uploadImage.js";
import Category from "../models/categoryModel.js";

// Upload single image
export const uploadCategoryImage = uploadSingleImage("image");

// Image proccessing
export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${uudiv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  // Save image in DB
  req.body.image = filename;

  next();
});

// @desc Get list of categories
// @route GET /api/v1/categories
// @access Public
export const getCategories = getAll(Category);

// @desc Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
export const getCategory = getOne(Category);

// @desc Create category
// @route POST /api/v1/categories
// @access Private/Admin-Manager
export const createCategory = createOne(Category);

// @desc Update specific category
// @route PUT /api/v1/categories/:id
// @access Private/Admin-Manager
export const updateCategory = updateOne(Category);

// @desc Delete specific category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin-Manager
export const deleteCategory = deleteOne(Category);
