// File name: ApiResponse
// File name with extension: ApiResponse.js
// Full path: E:\cloud_ShubhamJadhav\model\ApiResponse.js
// Directory: E:\cloud_ShubhamJadhav\model

class ApiResponse {
  constructor(success, data = null, message = "", count = 0, error = null) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.count = count;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = "Operation successful", count = null) {
    const actualCount =
      count !== null ? count : Array.isArray(data) ? data.length : 1;
    return new ApiResponse(true, data, message, actualCount);
  }

  static error(message = "Operation failed", error = null) {
    return new ApiResponse(false, null, message, 0, error);
  }

  static fromResult(result, successMessage = "Operation successful") {
    if (result.success) {
      return ApiResponse.success(
        result.data,
        successMessage,
        result.rowsAffected
      );
    } else {
      return ApiResponse.error(result.error);
    }
  }
}

module.exports = ApiResponse;
