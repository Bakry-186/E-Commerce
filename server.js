import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import sanitizeHtml from "sanitize-html";
import cors from "cors"

import "./config/connect.js"; // Connect with db
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/error.js";

import mountRoutes from "./routes/index.js";

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());

// Use fileURLToPath to get the current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Global Middlewares
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60min
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Data sanitization against NoSQL query injuction
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params);
  }
  // skip req.query if it's read-only
  next();
});

// Custom XSS sanitization middleware
app.use((req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query && typeof req.query === "object") sanitizeObject(req.query);

  next();
});

// Mount Routes
mountRoutes(app);

app.use(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shuting down.....`);
    process.exit(1);
  });
});
