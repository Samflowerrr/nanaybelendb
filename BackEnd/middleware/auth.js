const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        res.json({ success: false, message: 'No Token provided' });
    } else {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Token invalid: ' + err });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }

}