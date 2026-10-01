const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_jwt_key_2026');
    req.user = verified; // Attaches user payload (id, username, email) to req.user
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};// JWT verification logic added 
