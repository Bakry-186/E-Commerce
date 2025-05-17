import asyncHandler from "express-async-handler";

import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/handlerFactory.js";

import ApiError from "../utils/apiError.js";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc Create cash order
// @route POST /api/v1/orders/cartId
// @access Private/User
export const createCashOrder = asyncHandler(async (req, res, next) => {
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart by cart ID
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new ApiError("Cart not found.", 404));

  // 2) Assign order price based on cart total price "Check if there is applyed coupon"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method (Cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity and increament product sold
  if (order) {
    const bulkOpts = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOpts, {});
  }

  // 5) Delete cart after creating the order
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({ data: order });
});

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Private/Admin-Manager-User(Own)
export const getOrders = getAll(Order);

// @desc    Get specific order by id
// @route   POST /api/v1/orders/:id
// @access  Private/Admin-Manager-User(Own)
export const getOrder = getOne(Order);

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin-Manager
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ApiError("Order not found.", 404));

  order.status = req.body.status;
  await order.save();

  res
    .status(200)
    .json({
      message: `Order status updated to ${req.body.status}`,
      status: order.status,
      statusChangedAt: order.statusChangedAt,
    });
});
