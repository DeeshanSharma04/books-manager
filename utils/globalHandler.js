class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  return res.status(statusCode).json({ success: false, error: message });
};

const wrapper = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

class SuccessHandler {
  constructor(res, message, data = null) {
    this.message = message;
    this.data = data;
    this.res = res;
    this.handleSuccess();
  }

  handleSuccess() {
    return this.data
      ? this.res.json({
          success: true,
          message: this.message,
          data: this.data,
        })
      : this.res.json({ success: true, message: this.message });
  }
}

module.exports = { ErrorHandler, handleError, wrapper, SuccessHandler };
