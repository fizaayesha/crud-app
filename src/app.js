const express = require("express");
require("./db/connect.js"); // Import the database connection setup
// const { setupRateLimiting } = require("./middleware");
const notesRouter = require("./routers/note-routers");
const usersRouter = require("./routers/user-routers");
const app = express();

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});
const port = 8000;

// Use rate limiting middleware
// setupRateLimiting(app);

// Other middleware and routes
app.use(express.json());

app.use(usersRouter);
app.use(notesRouter);

app.listen(port, () => {
  console.log(`Connection is live at port no. ${port}`);
});
