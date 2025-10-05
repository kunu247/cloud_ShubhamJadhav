// File name: jwt
// File name with extension: jwt.js
// Full path: E:\cloud_ShubhamJadhav\jwt.js
// Directory: E:\cloud_ShubhamJadhav

require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_LIFE = process.env.JWT_LIFETIME;
const REFRESH_LIFE = process.env.REFRESH_LIFETIME;

const createJWT = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_LIFE });
const createRefreshJWT = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_LIFE });
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

const attachCookiesToResponse = (res, user) => {
  const access = createJWT(user);
  const refresh = createRefreshJWT(user);
  const cookieOptions = (days) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * days
  });
  res.cookie("token", access, cookieOptions(1 / 24)); // 1 hour
  res.cookie("refreshToken", refresh, cookieOptions(7)); // 7 days
};

module.exports = {
  createJWT,
  createRefreshJWT,
  verifyToken,
  verifyRefreshToken,
  attachCookiesToResponse
};
