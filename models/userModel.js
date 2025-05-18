import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required!"],
    },
    phone: String,

    email: {
      type: String,
      required: [true, "User email is required!"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required!"],
      minLength: [6, "Too short password!"],
    },
    role: {
      type: String,
      enum: ["customer", "admin", "manager"],
      default: "customer",
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    refreshTokens: [String],
  },
  { timestamps: true }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

export default mongoose.model("User", userSchema);
