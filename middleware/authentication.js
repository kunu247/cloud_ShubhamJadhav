// File name: authentication
// File name with extension: authentication.js
// Full path: E:\cloud_ShubhamJadhav\middleware\authentication.js
// Directory: E:\cloud_ShubhamJadhav\middleware

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || req.cookies?.token;

  if (!header) throw new UnauthenticatedError("Authorization token missing.");

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid or expired token.");
  }
};
