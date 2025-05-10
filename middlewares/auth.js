import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  // Check if token exist
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError("No access token!", 401));
  }

  // Verify token
  const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  // Check if user exist
  const user = await User.findById(decode.userId);
  if (!user) {
    return next(new ApiError("User no longer exist!", 401));
  }

  req.user = user;
  next();
};

export default verifyToken;
