// File name: unauthenticated
// File name with extension: unauthenticated.js
// Full path: E:\cloud_ShubhamJadhav\errors\unauthenticated.js
// Directory: E:\cloud_ShubhamJadhav\errors

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
