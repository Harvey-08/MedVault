const logEvent = require('./auditLogger');

/**
 * Centralized Express Error Handling Middleware.
 * Captures all runtime or custom errors, logs security incidents, and formats the response JSON.
 */
const errorHandler = (err, req, res, next) => {
  // If headers have already been sent to client, delegate to the default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const actorEmail = req.user ? req.user.email : 'anonymous';
  const actorRole = req.user ? req.user.role : 'anonymous';

  // JWT authorization error
  if (err.name === 'UnauthorizedError' || err.message === 'Invalid token.' || err.message === 'Access denied. No token provided.') {
    logEvent(actorEmail, actorRole, 'UNAUTHORIZED_ACCESS', 'DENIED', err.message);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or missing token.' });
  }

  // Mongoose validation or cast errors
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  // Joi schema validation
  if (err.isJoi) {
    return res.status(400).json({ success: false, error: err.details[0].message });
  }

  // Default server fallback error
  console.error('Unhandled Server Error:', err.stack || err.message);
  logEvent(actorEmail, actorRole, 'SERVER_ERROR', 'DENIED', err.message || 'Internal server error occurred');
  
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
