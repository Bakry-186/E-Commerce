import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../controllers/adminUserCtrl.js";

import {
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  userIdValidator,
} from "../utils/validators/adminUserValidator.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

// Admin routes require authentication and admin authorization
router.use(verifyToken, authorizeRoles("admin"));

// Admin CRUD Routes for Users
router
  .route("/") // Handle both getting all users and creating a new user
  .get(getUsers) // Get list of all users (admin-only)
  .post(createUserValidator, createUser); // Create new user (admin-only)

router
  .route("/:id") // Handle operations on a specific user by ID
  .get(userIdValidator, getUser) // Get user profile by ID (admin-only)
  .put(updateUserValidator, updateUser) // Update user profile by ID (admin-only)
  .delete(userIdValidator, deleteUser); // Delete user by ID (admin-only)

// Admin password change route for specific user
router.put("/:id/password", changeUserPasswordValidator, changePassword); 

export default router;
