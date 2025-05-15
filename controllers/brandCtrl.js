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
import Brand from "../models/brandModel.js";

// Upload single image
export const uploadBrandImage = uploadSingleImage("image");

// Image proccessing
export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  const filename = `brand-${uudiv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  // Save image in DB
  req.body.image = filename;

  next();
});

// @desc Get list of brands
// @route GET /api/v1/brands
// @access Public
export const getBrands = getAll(Brand);

// @desc Get specific brand by id
// @route GET /api/v1/brands/:id
// @access Public
export const getBrand = getOne(Brand);

// @desc Create brand
// @route POST /api/v1/brands
// @access Private/Admin-Manager
export const createBrand = createOne(Brand);

// @desc Update specific brand
// @route PUT /api/v1/brands/:id
// @access Private/Admin-Manager
export const updateBrand = updateOne(Brand);

// @desc Delete specific brand
// @route DELETE /api/v1/brands/:id
// @access Private/Admin-Manager
export const deleteBrand = deleteOne(Brand);
