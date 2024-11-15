const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

const getUserFromToken = async (token) => {
  try {
    if (!token) return null;
    console.log('JWT Token:', token);
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'aryan');
    console.log('Decoded User:', decoded);
    const user = await User.findById(decoded.id);
    return user ? { id: user.id, email: user.email, username: user.username } : null;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

module.exports = { getUserFromToken };
