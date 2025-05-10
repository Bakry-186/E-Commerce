import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deleteMyProfile,
} from "../controllers/meCtrl.js";

import {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressCtrl.js";

import {
  updateMyProfileValidator,
  changeMyPasswordValidator,
} from "../utils/validators/meValidator.js";

import {
  createAddressValidator,
  updateAddressValidator,
  addressIdValidator,
} from "../utils/validators/addressValidator.js";

import { getUser } from "../controllers/adminUserCtrl.js";

import verifyToken from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

// All routes below require token verification
router.use(verifyToken);

// Profile Routes for Current User (me)
router.get("/", getMyProfile, getUser); // Get logged-in user's profile
router.put("/", updateMyProfileValidator, updateMyProfile); // Update logged-in user's profile
router.put("/password", changeMyPasswordValidator, changeMyPassword); // Change password for logged-in user
router.delete("/", deleteMyProfile); // Delete logged-in user's profile

// Address Routes (for customers only)
router
  .route("/addresses") // Using plural "addresses" for collections
  .get(authorizeRoles("customer"), getAddresses) // Get all addresses for logged-in custor
  .post(authorizeRoles("customer"), createAddressValidator, createAddress); // Create a new address for logged-in custor

router
  .route("/addresses/:addressId") // Single address manipulation
  .get(authorizeRoles("customer"), addressIdValidator, getAddress) // Get specific address by ID
  .put(authorizeRoles("customer"), updateAddressValidator, updateAddress) // Update specific address by ID
  .delete(authorizeRoles("customer"), addressIdValidator, deleteAddress); // Delete specific address by ID

export default router;
