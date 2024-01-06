const express = require("express");
require("./db/connect"); // Import the database connection setup
const notesRouter = require("./routers/notesRoute");
const usersRouter = require("./routers/userRoute");
const app = express();
const port = 5000;
const { authenticateJWT, setupRateLimiting } = require("./middleware");

// Use rate limiting middleware
setupRateLimiting(app);

app.use(express.json()); 
app.use("/api/", authenticateJWT); // Apply JWT authentication middleware to all routes under /api

app.use(usersRouter);
app.use(notesRouter); 

app.listen(port, () => {
  console.log(`Connection is live at port no. ${port}`);
});
