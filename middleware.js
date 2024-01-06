// middleware.js
const jwt = require("jsonwebtoken");
const createError = require("http-errors"); // Import the 'http-errors' module
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const dotenv = require("dotenv"); // Import the 'dotenv' module

// Function to set up rate limiting middleware
function setupRateLimiting(app) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  // Create a speed limiter with a window of 15 minutes, allowing 50 requests per minute, then introducing a delay of 500ms
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per minute, then...
    delayMs: () => 500,
  });

  app.use("/api/", limiter);
  app.use("/api/", speedLimiter);
}

// Function to authenticate JWT tokens
function authenticateJWT(req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }

    req.payload = payload;

    next();
  });
}

module.exports = { setupRateLimiting, authenticateJWT };
