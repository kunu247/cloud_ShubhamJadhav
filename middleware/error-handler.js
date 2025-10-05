// File name: error-handler
// File name with extension: error-handler.js
// Full path: E:\cloud_ShubhamJadhav\middleware\error-handler.js
// Directory: E:\cloud_ShubhamJadhav\middleware

const { StatusCodes } = require("http-status-codes");

module.exports = (err, req, res, next) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something went wrong, please try again.";

  console.error("[ERROR]", err);

  if (err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: Object.values(err.errors).map((e) => e.message).join(", ")
    });
  }

  if (err.code === "EREQUEST" || err.number === 2627) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: "SQL constraint violation."
    });
  }

  if (["JsonWebTokenError", "TokenExpiredError"].includes(err.name)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: "Invalid or expired token."
    });
  }

  return res.status(status).json({ success: false, msg });
};
