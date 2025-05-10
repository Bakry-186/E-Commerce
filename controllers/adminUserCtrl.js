import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import {
  createOne,
  getAll,
  getOne,
  deleteOne,
} from "../utils/handlerFactory.js";

import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";

import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "../utils/generateTokens.js";

// @desc Get all users
// @route GET /api/v1/users
// @access Private/Admin
export const getUsers = getAll(User);

// @desc Get specific user
// @route GET /api/v1/users/:id
// @access Private/Admin
export const getUser = getOne(User);

// @desc Create a new user
// @route POST /api/v1/users
// @access Private/Admin
export const createUser = createOne(User);

// @desc Update user details
// @route PUT /api/v1/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  res.status(200).json({ data: user });
});

// @desc Change user password
// @route PUT /api/v1/users/:id/password
// @access Private/Admin
export const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  setAuthCookies(res, refreshToken);

  res
    .status(200)
    .json({ message: "Password changed successfully.", token: accessToken });
});

// @desc Delete a user
// @route DELETE /api/v1/users/:id
// @access Private/Admin
export const deleteUser = deleteOne(User);
