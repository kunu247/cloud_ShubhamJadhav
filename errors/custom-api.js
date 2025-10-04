// File name: custom-api
// File name with extension: custom-api.js
// Full path: E:\cloud_ShubhamJadhav\errors\custom-api.js
// Directory: E:\cloud_ShubhamJadhav\errors

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = CustomAPIError;
