const express = require("express");

const User = require("../models/user.js");
const auth = require("../middlewares/auth.js");

const router = new express.Router();

// Create User
router.post("/users", async (req, res) => {
    const { username, email, password } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    if (password.length < 8) {
        return res.status(400).send({
            message: "Password has to be minimum 8 characters",
        });
    }

    const user = new User({ username, email, password });

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token, message: "New Account Created!" });
    } catch (e) {
        console.log(e);

        if (e.code === 11000 && e.keyPattern && e.keyPattern.email === 1) {
            res.status(400).send({ message: "Email already in use" });
        } else {
            res.status(500).send({ message: "Something went wrong" });
        }
    }
});

//Login User
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.username,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(500).send({ message: "Unable to login" });
    }
});

//Logout User
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send({ message: "Logged Out" });
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get User Details
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

//Delete User
router.delete("/users/delete", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send({
            message: "Your account was deleted along with all your data",
        });
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
