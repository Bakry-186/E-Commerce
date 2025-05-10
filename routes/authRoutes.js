import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  refresh,
} from "../controllers/authCtrl.js";

import {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetCodeValidator,
  resetPasswordValidator,
} from "../utils/validators/authValidator.js";

import verifyToken from "../middlewares/auth.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", signupValidator, signup); // Signup new user
router.post("/login", loginValidator, login); // Login existing user
router.post("/logout", verifyToken, logout); // Logout current user

// Password Routes
router.post("/password/forgot", forgotPasswordValidator, forgotPassword); // Request for password reset email
router.post("/password/reset/verify", resetCodeValidator, verifyPassResetCode); // Verify the reset code
router.put("/password/reset", resetPasswordValidator, resetPassword); // Reset password with new one
router.post("/refresh", refresh); // Resfresh token

export default router;
