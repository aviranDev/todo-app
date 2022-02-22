const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const payload = jwt.verify(token, process.env.PRIVET_KEY);
    req.user = payload;
    next()
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}