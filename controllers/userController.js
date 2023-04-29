const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register the new user
//@route POST /api/users/register
//@access public
const newUserRegistration = asyncHandler(async (req, res) => {
    const { username , email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email }) || await User.findOne({ username });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if(user) {
        res.status(201).json({ _id: user.id, username: user.username, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password is invalid");
    }
});

//@desc Current user information
//@route GET /api/users/login
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    newUserRegistration,
    loginUser,
    currentUser,
}