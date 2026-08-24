const jwt = require('jsonwebtoken');

// Allows both guests and logged-in customers
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only attach customer identity
    if (decoded.customerId) {
      req.customerId = decoded.customerId;
    }
  } catch (err) {
    // Invalid/expired token → continue as guest
    console.log('Optional customer auth failed:', err.message);
  }

  next();
}


// Requires a valid customer login
function requireCustomerAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Customer authentication required.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure this is actually a customer token
    if (!decoded.customerId) {
      return res.status(401).json({
        error: 'Invalid customer token.',
      });
    }

    req.customerId = decoded.customerId;

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired customer token.',
    });
  }
}


module.exports = {
  optionalAuth,
  requireCustomerAuth,
};