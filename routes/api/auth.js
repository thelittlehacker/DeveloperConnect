const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public
router.post('/', async (req, res) => {

    const {
        email,
        password
    } = req.body

    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            return res.status(400).json({
                error: [{
                    msg: 'Invalid credential'
                }]
            })
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {
            return res.status(400).json({
                error: [{
                    msg: 'Invalid credential'
                }]
            })
        }

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