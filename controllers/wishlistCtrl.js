import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  // Add a new product if it doesn't already exist in the array (by deep equality)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.productId } }, // avoids adding duplicate productes
    { new: true }
  );

  res.status(201).json({
    message: "Product added successfully to your wishlist.",
    data: user.wishlist,
  });
});

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
export const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({ result: user.wishlist.length, data: user.wishlist });
});

// @desc    delete product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User
export const deleteProductFromWishlist = asyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const productIndex = user.wishlist.findIndex(
      (product) => product.toString() === req.params.productId
    );
    if (productIndex === -1)
      return next(new ApiError("product not found.", 404));

    // Delete the product subdocument by ID using $pull
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );

    res.status(200).json({
      message: "product deleted successfully from your wishlist.",
    });
  }
);
