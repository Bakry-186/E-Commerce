import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";

// Calculate Total Cart Price
const calculateTotalPrice = (cart) => {
  const total = cart.cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  cart.totalPrice = total;
  cart.totalPriceAfterDiscount = undefined;

  return total;
};

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private/User
export const addProductToCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(req.body.product);
  if (!product) return next(new ApiError("Product not found.", 404));

  if (!cart) {
    // Create cart and add product to it
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.product,
          color: req.body.color,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex((item) => {
      return (
        item.product.toString() === req.body.product &&
        item.color === req.body.color
      );
    });

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity++;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: req.body.product,
        color: req.body.color,
        price: product.price,
      });
    }
  }

  cart.totalCartPrice = calculateTotalPrice(cart);
  await cart.save();

  res
    .status(201)
    .json({ message: "Product added successfully to cart.", data: cart });
});

// @desc    Get cart for logged user
// @route   GET /api/v1/cart
// @access  Private/User
export const getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("Cart not found.", 404));

  res.status(200).json({ data: cart });
});

// @desc    Delete cart for logged user
// @route   DELETE /api/v1/cart
// @access  Private/User
export const deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) return next(new ApiError("Cart not found.", 404));

  res.status(200).json({ message: "Cart deleted successfully." });
});

// @desc Update cart item quantity
// @route PUT /api/v1/cart/:itemId
// @access Private/User
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("Cart not found.", 404));

  const itemIndex = cart.cartItems.findIndex((item) => {
    return item._id.toString() === req.params.itemId;
  });

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError("Item not found in cart.", 404));
  }

  let totalPrice = 0;

  cart.totalCartPrice = calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({ numOfItems: cart.cartItems.length, data: cart });
});

// @desc    Delete item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
export const deleteItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("Cart not found.", 404));

  const itemExists = cart.cartItems.some(
    (item) => item._id.toString() === req.params.itemId
  );

  if (!itemExists) {
    return next(new ApiError("Item not found in cart.", 404));
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!updatedCart.cartItems.length) {
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(200).json({
      message: "Item removed and cart deleted because it became empty.",
    });
  }

  updatedCart.totalCartPrice = calculateTotalPrice(updatedCart);
  await cart.save();

  res
    .status(200)
    .json({ numOfItems: updatedCart.cartItems.length, data: updatedCart });
});

// @desc    Apply coupon on cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
export const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon code
  const coupon = await Coupon.findOne({
    code: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) return next(new ApiError("Coupon is invalid or expired.", 400));

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res
    .status(200)
    .json({ numOfItems: cart.cartItems.length, data: cart });
});
