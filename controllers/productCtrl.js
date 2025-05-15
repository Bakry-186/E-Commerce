import asyncHandler from "express-async-handler";
import { v4 as uudiv4 } from "uuid";
import sharp from "sharp";

import { uploadMixOfImages } from "../middlewares/uploadImage.js";
import Product from "../models/productModel.js";

import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/handlerFactory.js";

// Upload array of images
export const uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Images proccessing
export const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uudiv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image in DB
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageFileName = `product-${uudiv4()}-${Date.now()}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageFileName}`);

        // Save image in DB
        req.body.images.push(imageFileName);
      })
    );
  }

  next();
});

// @desc Get list of products
// @route GET /api/v1/products
// @access Public
export const getProducts = getAll(Product, "products");

// @desc Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
export const getProduct = getOne(Product, "reviews");

// @desc Create product
// @route POST /api/v1/products
// @access Private/Admin-Manager
export const createProduct = createOne(Product);

// @desc Update specific product
// @route PUT /api/v1/products/:id
// @access Private/Admin-Manager
export const updateProduct = updateOne(Product);

// @desc Delete specific product
// @route DELEtTE /api/v1/products/:id
// @access Private/Admin
export const deleteProduct = deleteOne(Product);
