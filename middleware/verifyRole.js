const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyRole = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json('You are not authorized to access this route');
  }

  const decoded = jwt.verify(config.jwtSecretKey);
  if (!decoded || decoded.role !== 'doctor') {
    return res.status(403).json('You are not authorized to access this token');
  }
  req.id = decoded.user;
  req.email = decoded.email;
  req.role = decoded.role;
  next();
};

module.exports = {
  verifyRole,
};
