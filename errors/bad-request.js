// File name: bad-request
// File name with extension: bad-request.js
// Full path: E:\cloud_ShubhamJadhav\errors\bad-request.js
// Directory: E:\cloud_ShubhamJadhav\errors

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
