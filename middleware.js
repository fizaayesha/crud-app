const jwt = require("jsonwebtoken");

const User = require("./models/Users.js");

// // Function to set up rate limiting middleware
// function setupRateLimiting(app) {
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   });

//   // Create a speed limiter with a window of 15 minutes, allowing 50 requests per minute, then introducing a delay of 500ms
//   const speedLimiter = slowDown({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     delayAfter: 50, // allow 50 requests per minute, then...
//     delayMs: () => 500,
//   });

//   app.use("/api/", limiter);
//   app.use("/api/", speedLimiter);
// }

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.NOTER_JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ Error: "Unauthenticated" });
  }
};

module.exports = auth ;
