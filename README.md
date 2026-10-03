# E-Commerce API

A production-style backend for a modern e-commerce platform built with Node.js, Express, and MongoDB. This project demonstrates a full-stack understanding of secure API design, authentication, role-based access control, checkout flows, and scalable backend architecture.

This repository highlights real-world backend engineering principles such as validation, request sanitization, JWT authentication, image handling, and database-driven commerce workflows.

---

## Project Overview

This API powers the core functionality of an online store, including:

- User authentication and account management
- Product catalog and category management
- Cart and wishlist features
- Coupon and discount logic
- Order creation and payment session flow
- Admin operations for managing store data
- Secure, production-minded middleware and validation layers

The system is built for a real-world commerce use case and follows a modular backend structure commonly used in professional codebases.

---

## Why This Project Is Relevant for Employers

This project demonstrates practical skills that are highly valued in backend and full-stack roles:

- REST API design and route organization
- MongoDB data modeling with Mongoose
- JWT-based authentication and refresh-token flow
- Role-based authorization for customer/admin/manager access
- Input validation and security hardening
- File upload and image processing for product assets
- Payment-ready checkout architecture with Stripe integration
- Clean controller/service pattern with reusable utilities

This is the kind of project that shows a developer can build beyond simple CRUD and into real commercial application logic.

---

## Core Features

### Authentication & User Management

- User signup and login
- JWT access/refresh token handling
- Password reset and verification flow
- Protected routes with auth middleware
- Role-based access for admin and manager users
- Secure cookie-based refresh token handling

### Catalog & Store Features

- Product creation and updates
- Category and subcategory management
- Brand management
- Review and rating system
- Wishlist and cart management
- Coupon application logic
- Product image upload and resizing

### Order & Checkout Flow

- Cash order creation
- Stripe checkout session creation
- Order status updates
- Customer-specific order retrieval
- Admin and manager order visibility

### Security & Reliability

- Request rate limiting
- Helmet security headers
- NoSQL injection sanitization
- HTML sanitization for request fields
- Validation middleware using Express Validator
- Centralized error handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Stripe for checkout payments
- Multer + Sharp for image uploads
- bcrypt for hashing
- nodemailer for email-based password reset
- Helmet, CORS, Rate Limit, and sanitization middleware

---

## Project Structure

```bash
.
├── config/
│   └── connect.js
├── controllers/
│   ├── authCtrl.js
│   ├── productCtrl.js
│   ├── cartCtrl.js
│   ├── orderCtrl.js
│   └── ...
├── middlewares/
│   ├── auth.js
│   ├── role.js
│   ├── validator.js
│   ├── uploadImage.js
│   └── error.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── cartModel.js
│   ├── orderModel.js
│   └── ...
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── ...
├── utils/
│   ├── apiError.js
│   ├── apiFeatures.js
│   ├── generateTokens.js
│   └── ...
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

## Prerequisites

Before running this project, make sure you have:

- Node.js v18+
- MongoDB running locally or in a cloud service
- A Stripe account for checkout integration
- A valid SMTP provider for password reset emails

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/e-commerce-api.git
cd e-commerce-api
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory

```bash
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. Start the server

```bash
npm run dev
```

For production mode:

```bash
npm start
```

---

## API Overview

The app exposes REST APIs under the base path:

```bash
/api/v1
```

### Authentication

- POST /api/v1/auth/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/password/forgot
- POST /api/v1/auth/password/reset/verify
- PUT /api/v1/auth/password/reset
- POST /api/v1/auth/refresh

### Catalog

- GET /api/v1/products
- GET /api/v1/products/:id
- POST /api/v1/products (admin/manager)
- PUT /api/v1/products/:id (admin/manager)
- DELETE /api/v1/products/:id (admin)
- GET /api/v1/categories
- GET /api/v1/brands
- GET /api/v1/reviews

### Cart & Wishlist

- POST /api/v1/cart
- GET /api/v1/cart
- PUT /api/v1/cart/:itemId
- DELETE /api/v1/cart/:itemId
- PUT /api/v1/cart/apply-coupon
- POST /api/v1/wishlist
- GET /api/v1/wishlist
- DELETE /api/v1/wishlist/:productId

### Orders

- POST /api/v1/orders/:cartId
- POST /api/v1/orders/checkout-session/:cartId
- GET /api/v1/orders
- GET /api/v1/orders/:id
- PUT /api/v1/orders/:id/status

### Admin Operations

- User management routes
- Coupon management routes
- Product and category administration
- Order state updates

---

## Security Highlights

This project includes several important production safeguards:

- rate limiting for abuse prevention
- CORS configuration
- JWT-based access control
- HTTP-only cookies for refresh tokens
- input validation to reduce malformed requests
- MongoDB sanitization to prevent query injection
- XSS sanitization for request data
- centralized error handling for consistent API responses

---

## Business Logic Included

This backend was designed around realistic e-commerce operations:

- Customers can browse products and manage a cart
- Admins can manage inventory and catalog data
- Managers can oversee operational tasks
- Discount coupons can be applied in the cart
- Checkout can be processed through Stripe payment sessions
- Orders carry user-specific access controls and status workflows

---

## Future Improvements

Potential next enhancements for this project include:

- Payment webhook handling for real transaction confirmation
- Elasticsearch or search indexing for catalog queries
- Redis caching for frequent product listings
- Dockerization for simplified deployment
- CI/CD pipeline setup
- Test suite with Jest or Vitest
- Swagger/OpenAPI documentation

---

## Portfolio Summary

This project showcases the type of backend work expected from a modern web developer:

- API-first development
- secure authentication and authorization
- strong database and schema design
- e-commerce domain modeling
- production-minded safeguards and validations
- real-world workflows beyond boilerplate CRUD

For recruiters and hiring managers, this is a practical demonstration of full backend engineering capability in a commerce environment.

---

## License

This project is licensed under the ISC License.

---
