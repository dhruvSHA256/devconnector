const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/User.js");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;

if (!JWT_TOKEN) {
    console.error('[error]: The "JWT_TOKEN" environment variable is required');
    process.exit(1);
}

//@route    POST api/users
//@desc     Register users
//@access   Public
router.post(
    "/",
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please give a valid email").isEmail(),
    check("password", "Length must be > 6").isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;

        try {
            // error if user exist
            let user = await User.findOne({ email });

            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }
            // else set gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // set user properties
            user = new User({ name, email, avatar, password: hashedPassword });

            // save user in db
            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            // return jwt
            jwt.sign(payload, JWT_TOKEN, { expiresIn: 360000 }, (err, token) => {
                if (err) {
                    throw err;
                } else {
                    return res
                        .status(200)
                        .json({ success: { msg: "User Registered" }, token });
                }
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
        }
    }
);
module.exports = router;
