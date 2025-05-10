import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User from "../models/userModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "../utils/generateTokens.js";

// @desc Get my profile
// @route GET /api/v1/users/me
// @access Private
export const getMyProfile = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update my profile
// @route PUT /api/v1/users/me
// @access Private
export const updateMyProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: user });
});

// @desc Change my password
// @route PUT /api/v1/users/me/password
// @access Private
export const changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.password, 10),
    passwordChangedAt: Date.now(),
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  setAuthCookies(res, refreshToken);

  res
    .status(200)
    .json({ message: "Password changed successfully.", token: accessToken });
});

// @desc Delete my profile
// @route DELETE /api/v1/users/me
// @access Private
export const deleteMyProfile = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({ message: "Profile deleted successfully." });
});
