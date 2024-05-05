const jwt = require('jsonwebtoken')
const secret = require('../crypto/config');

function generateToken(user) {
    return jwt.sign({ user: user.id}, secret, { expiresIn: '1h'});
}

const verifyToken = (req, res, next) => {
    const token = req.session.token;

    if (!token) { return res.status(401).json({ mensaje: 'Token no proporcionado' })}

    checkJWT(token, req, res);

    next();
}

const alreadyLoged = (req, res, next) => {
    const token = req.session.token;

    if (token) {
        checkJWT(token, req, res);
    }

    next();
}

function checkJWT(token, req, res) {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) { return res.status(401).json({ mensaje: 'El token no es valido' })}

        req.user = decoded.user;
    });
}



module.exports = {generateToken, verifyToken, alreadyLoged};