import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to user."],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
      default: "Processing",
    },
    statusChangedAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg phone email",
  }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });

  next();
});

// Update `statusChangedAt` when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusChangedAt = Date.now();
    // Check if order is delivered
    if (this.status === "Delivered") {
      this.isDelivered = true;
      this.deliveredAt = Date.now();
      // Check if payment method is cash
      if (this.paymentMethod === "cash") {
        this.isPaid = true;
        this.paidAt = Date.now();
      }
    }
  }
  next();
});

export default mongoose.model("Order", orderSchema);
