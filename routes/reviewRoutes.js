import express from "express";

import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  setProductIdToBody,
  setUserToBody,
} from "../controllers/reviewCtrl.js";

import {
  reviewIdValidator,
  reviewOwnerValidator,
  createReviewValidator,
  updateReviewValidator,
} from "../utils/validators/reviewValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";
import createFilterObj from "../middlewares/filter.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj({ productParam: true }), getReviews)
  .post(
    verifyToken,
    authorizeRoles("customer"),
    createFilterObj({ productParam: true }),
    setProductIdToBody,
    setUserToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(reviewIdValidator, getReview)
  .put(verifyToken, updateReviewValidator, updateReview)
  .delete(verifyToken, reviewOwnerValidator, deleteReview);

export default router;
