const jwt = require("jsonwebtoken");

exports.verify = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) res.status(403).json({ error: "authentication failed" });
  else {
    jwt.verify(token?.split(" ")[1], "ex-theorie", (err, value) => {
      if (err) res.status(500).json({ error: "authentication failed" });
      req.user = value.data;
      next();
    });
  }
};
