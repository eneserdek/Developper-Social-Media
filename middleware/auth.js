const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token) {
    return res.status(401 /*not authorized*/).json({ msg: `No token, authorization denied` });
  }

  // there may be a token but we need to verify it
  // verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: `Token is not valid` });
  }
};
// we are gonna implement this to the protected route
