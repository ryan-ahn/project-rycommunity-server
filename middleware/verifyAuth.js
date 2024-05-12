const jwt = require('jsonwebtoken');

const verifyAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json('You are not authorized to access this route');
  }

  const decoded = await jwt.verify(token, config.jwtSecretKey);
  if (!decoded) {
    return res.status(403).json('You are not authorized to access this token');
  }

  if (decoded.role === 'doctor') {
    req.email = decoded.email;
  } else {
    req.id = req.query.doctor;
  }
  console.log('id', req.id);
  next();
};

module.exports = {
  verifyAuth,
};
