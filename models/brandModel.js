import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required!"],
      unique: [true, "Brand must be unique!"],
      minLength: [2, "Too short brand name!"],
      maxLength: [32, "Too long brand name!"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// find and update
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

// create
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

export default mongoose.model("Brand", brandSchema);
