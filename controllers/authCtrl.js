import crypto from "crypto";

import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { sendEmail } from "../utils/sendEmail.js";

import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "../utils/generateTokens.js";

import { generateResetCode } from "../utils/generateResetCode.js";
import { resetPasswordEmail } from "../utils/emailTemplates.js";

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({ data: user });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, refreshToken);

  res.status(200).json({ token: accessToken });
});

// @desc Login
// @route POST /api/v1/auth/logout
// @access Private
export const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return next(new ApiError("No refresh token provided.", 400));

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (user) {
    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);
    await user.save();
  }

  res.clearCookie("refreshToken").status(200).json({
    message: "Logged out successfully.",
  });
});

// @desc Forgot password
// @route POST /api/v1/auth/password/forgot
// @access Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  // if user exist, generate hash reset random 6 digit and save it in DB
  const { resetCode, hashedResetCode } = generateResetCode();

  // Store hashed reset code in DB
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  //Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message: resetPasswordEmail(user.name, resetCode),
    });
  } catch (e) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    return next(new ApiError("There is error in sending email.", 500));
  }

  res.status(200).json({ message: "Reset code sent to email." });
});

// @desc Verify reset password code
// @route POST /api/v1/auth/password/reset/verify
// @access Public
export const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const resetCode = req.body.resetCode.toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or expired!"));
  }

  // Verify reset code
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ message: "Code verified, you may reset password" });
});

// @desc Reset password
// @route PUT /api/v1/auth/password/reset
// @access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified!", 400));
  }

  // Save new password in DB
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setAuthCookies(res, refreshToken);

  res
    .status(200)
    .json({ message: "Password reseted successfully.", token: accessToken });
});

// @desc Refresh token
// @route POST /api/v1/auth/refresh
// @access Public
export const refresh = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new ApiError("No refresh token", 400));

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user || !user.refreshTokens.includes(token))
    return next(new ApiError("Invalid refresh token", 403));

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Replace the old token with new one
  user.refreshTokens = user.refreshTokens.filter((rt) => rt !== token);

  user.refreshTokens.push(newRefreshToken);
  await user.save();

  setAuthCookies(res, newRefreshToken);

  res.status(200).json({ token: newAccessToken });
});
