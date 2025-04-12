const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  
  const token = req.header('Authorization')?.split(' ')[1];
  


  // console.log(token);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // console.log( process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch(err) {
    console.log(err);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
