const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator')

// @route  POST api/user
// @desc   Register User
// @access Public
router.post('/', [
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Passwod is Required').not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let {
        name,
        email,
        password,
        role
    } = req.body

    try {
        let user = await User.findOne({
            email
        })
        console.log(user)
        if (user) {
            return res.status(400).json({
                error: [{
                    msg: 'User already exist'
                }]
            })
        }

        if (role == null) {
            role = 'user';
        }

        user = new User({
            name,
            email,
            password,
            role
        })

        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Return JsonWebToken
        const payload = {

            user: {
                id: user.id,
                role: user.role
            }
        }

        jwt.sign(payload, config.get('jwtToken'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({
                token
            });
        })



    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error');
    }
})

module.exports = router;