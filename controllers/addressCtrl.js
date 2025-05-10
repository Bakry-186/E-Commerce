import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";

// @desc    Create address for logged user
// @route   POST /api/v1/users/me/addresses
// @access  Protected/User
export const createAddress = asyncHandler(async (req, res, next) => {
  // Add a new address if it doesn't already exist in the array (by deep equality)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } }, // avoids adding duplicate addresses
    { new: true }
  );

  res
    .status(201)
    .json({ message: "Address added successfully.", data: user.addresses });
});

// @desc    Get all addresses for logged user
// @route   GET /api/v1/users/me/addresses
// @access  Protected/User
export const getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ result: user.addresses.length, data: user.addresses });
});

// @desc    Get specific address by ID for logged user
// @route   GET /api/v1/users/me/addresses/:addressId
// @access  Protected/User
export const getAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Find address in user's addresses array by matching ObjectId
  const address = user.addresses.find(
    (addr) => addr._id.toString() === req.params.addressId
  );

  if (!address) return next(new ApiError("Address not found.", 404));

  res.status(200).json({ data: address });
});

// @desc    Update specific address for logged user
// @route   PUT /api/v1/users/me/addresses/:addressId
// @access  Protected/User
export const updateAddress = asyncHandler(async (req, res, next) => {
  // Find user and ensure the address exists
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      "addresses._id": req.params.addressId, // match address by ID
    },
    {
      // Use positional operator ($) to update matched subdocument
      $set: {
        "addresses.$.alias": req.body.alias,
        "addresses.$.details": req.body.details,
        "addresses.$.phone": req.body.phone,
        "addresses.$.city": req.body.city,
        "addresses.$.postalCode": req.body.postalCode,
      },
    },
    { new: true }
  );

  if (!user) return next(new ApiError("Address not found", 404));

  res.status(200).json({
    message: "Address updated successfully.",
    data: user.addresses,
  });
});

// @desc    Delete specific address for logged user
// @route   DELETE /api/v1/users/me/addresses/:addressId
// @access  Protected/User
export const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const addressExists = user.addresses.id(req.params.addressId);
  if (!addressExists) return next(new ApiError("Address not found", 404));

  // Remove the address subdocument by ID using $pull
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  if (!user) return next(new ApiError("Address not found", 404));

  res.status(200).json({
    message: "Address deleted successfully.",
  });
});
