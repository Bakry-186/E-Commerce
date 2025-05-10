import crypto from "crypto";

export const generateResetCode = () => {
  // Generate a random 6-digit reset code (from 100000 to 999999)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Hash the reset code using the SHA-256 algorithm
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Return both the raw reset code and the hashed reset code
  return { resetCode, hashedResetCode };
};
