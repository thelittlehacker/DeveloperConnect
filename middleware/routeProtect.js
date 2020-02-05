module.exports = function (req, res, next) {

    try {
        const role = req.user.role;

        if (!role) {
            return res.status(401).json({
                msg: "Unauthorized Access"
            })
        }

        if (role == 'admin') {
            next();
        } else
            return res.status(401).send('Unauthorized Access')
    } catch (error) {
        res.status(401).json({
            msg: 'User is not valid'
        })

    }

}




