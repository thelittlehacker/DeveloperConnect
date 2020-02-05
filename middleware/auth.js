const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = function (req, res, next) {
    // Get the token from header

    const token = req.header('x-auth-token')


    //Check if not token

    if (!token) {
        return res.status(401).json({
            msg: "No token, authorization denied"
        })
    }

    // Verify token

    try {
        const decoded = jwt.verify(token, config.get('jwtToken'))

        //Take the request object and assign the value to user  = setting to decoded value which has user payload.
        req.user = decoded.user;
        req.role = decoded.role
        next();

    } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid'
        })
    }
}