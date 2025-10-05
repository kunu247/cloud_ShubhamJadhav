// File name: full-auth
// File name with extension: full-auth.js
// Full path: E:\cloud_ShubhamJadhav\middleware\full-auth.js
// Directory: E:\cloud_ShubhamJadhav\middleware

const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  let token;

  // Try getting token from Bearer header first
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token)
    throw new CustomError.UnauthenticatedError("Authentication token missing.");

  try {
    const payload = isTokenValid(token);
    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Invalid or expired token.");
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new CustomError.BadRequestError(
        "Unauthorized access to this resource."
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
