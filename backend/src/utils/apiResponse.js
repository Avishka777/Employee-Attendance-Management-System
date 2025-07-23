class ApiResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  send(res) {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data
    });
  }
}

module.exports = ApiResponse;