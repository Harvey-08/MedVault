
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
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



module.exports = auth;
