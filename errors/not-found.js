// File name: not-found
// File name with extension: not-found.js
// Full path: E:\cloud_ShubhamJadhav\errors\not-found.js
// Directory: E:\cloud_ShubhamJadhav\errors

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
