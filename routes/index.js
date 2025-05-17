import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import meRouter from "./meRoutes.js";
import brandRouter from "./brandRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import subCategoryRouter from "./subCategoriesRoutes.js";
import productRouter from "./productRoutes.js";
import cartRouter from "./cartRoutes.js";
import wishlistRouter from "./wishlistRoutes.js";
import reviewRouter from "./reviewRoutes.js";
import couponRouter from "./couponRoutes.js";
import orderRouter from "./orderRoutes.js";

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users/me", meRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/orders", orderRouter);
};

export default mountRoutes;
