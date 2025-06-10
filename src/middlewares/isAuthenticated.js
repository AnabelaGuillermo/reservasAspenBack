// src/middlewares/isAuthenticated.js
import HttpCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const { headers } = req;

  const authorizationHeader = headers.authorization;

  if (!authorizationHeader) {
    res.status(HttpCodes.UNAUTHORIZED).json({
      data: null,
      message: 'No se encontró un token en la petición',
    });
    return;
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    console.log('isAuthenticated: Token verified successfully.');
    console.log('isAuthenticated: Decoded data from JWT:', data);
    console.log('isAuthenticated: Decoded data.user from JWT:', data.user);
    req.user = data.user;

    if (!req.user) {
        console.error('isAuthenticated: req.user is undefined after decoding token!');
        return res.status(HttpCodes.UNAUTHORIZED).json({
            message: 'Token valid but user data missing in payload.'
        });
    }
    if (typeof req.user.isAdmin === 'undefined') {
        console.error('isAuthenticated: req.user exists but isAdmin property is missing!');
        return res.status(HttpCodes.FORBIDDEN).json({
            message: 'Token valid but isAdmin property missing from user data.'
        });
    }

    next();
  } catch (error) {
    console.error('isAuthenticated: Token verification failed:', error); // Log the actual error
    res.status(401).json({
      data: null,
      message: 'El token no es válido',
      error: error.message
    });
  }
};