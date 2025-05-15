import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      unique: [true, "Name must be unique!"],
      minLength: [3, "Too short category name!"],
      maxLength: [32, "Too long category name!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// find and update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

// create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

export default mongoose.model("Category", categorySchema);
