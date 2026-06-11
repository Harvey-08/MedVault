
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
}

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // You can access the user info from req.user in the protected routes
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

auth.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User context missing.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' });
    }
    next();
  };
};

module.exports = auth;
