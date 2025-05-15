import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required!"],
      unique: [true, "Name must be unique!"],
      minLength: [2, "Too short SubCategory name!"],
      maxLength: [32, "Too long SubCategory name!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to main category!"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
