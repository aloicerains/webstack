const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      req.userData = {
        email: decodedToken.email,
        userId: decodedToken.userId,
        userType: decodedToken.userType
      };
      next();
    } catch (error) {
        res.status(401).json({ message:  'You are not authenticated!' });
    }
  } catch (error) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
};