const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = new express.Router();
const UserSchema = require("../models/Users");
require("dotenv").config();

router.post("/auth/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else {
      const user = new UserSchema({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash,
        email: req.body.email,
      });
      user
        .save()
        .then((result) => {
          res.status(200).json({
            new_user: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

router.post("/auth/login", async (req, res, next) => {
  UserSchema.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          msg: "user not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: "password matching fail",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              email: user[0].email,
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            username: user[0].username,
            email: user[0].email,
            token: token,
          });
        }
      });
    })
    .catch((e) => {
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = router;
