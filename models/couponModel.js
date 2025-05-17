import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: [true, "Coupon code is required."],
      unique: [true, "Coupon must be unique."],
    },
    expire: {
      type: Date,
      required: [true, "Coupon date is required."],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value is required."],
      min: [0, "Discount must be at least 0%."],
      max: [100, "Discount cannot exceed 100%."],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
