import Review from "../models/reviewModel.js";

import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/handlerFactory.js";

export const setProductIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

export const setUserToBody = (req, res, next) => {
  console.log("requser:" + req.user._id + "bhody: " + req.body.user)
  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
};

// Nested route
// @desc Get list of reviews that belong to specific product
// GET /api/products/:productId/reviews
// @access Public

// @desc Get list of reviews
// @route GET /api/v1/reviews
// @access Private/Admin-Manager
export const getReviews = getAll(Review);

// @desc Get specific review by id
// @route GET /api/v1/reviews/:id
// @access Public
export const getReview = getOne(Review);

// Nested route
// @desc Create reviews that belong to specific product
// POST /api/products/:productId/reviews
// @access Private/User
export const createReview = createOne(Review);

// @desc Update specific review
// @route PUT /api/v1/reviews/:id
// @access Private/Admin-Manager-User(own)
export const updateReview = updateOne(Review);

// @desc Delete specific review
// @route DELETE /api/v1/reviews/:id
// @access Private/Admin-Manager-User(own)
export const deleteReview = deleteOne(Review);
