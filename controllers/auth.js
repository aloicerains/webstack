// authorize users
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] 
  // authHeader =  'Bearer Token'
  if (!token) {
    res.status(401).json({error: "Not authorized"});
    return;
  }
  try {
    const user = await jwt.verify(token, process.env.ACESS_TOKEN_SECRET);
    req.user = user;
    return
  } catch (err) {
    res.status(403).json({error: "Forbidden"});
    return;
  }
};

  
