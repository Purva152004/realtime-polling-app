const rateLimit = {};

module.exports = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimit[ip]) {
    rateLimit[ip] = now;
    return next();
  }

  if (now - rateLimit[ip] < 1000) {
    return res.status(429).json({ message: "Too many requests" });
  }

  rateLimit[ip] = now;
  next();
};
