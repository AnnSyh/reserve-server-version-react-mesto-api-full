const { ERR_HTTP_INVALID_STATUS_CODE } = require('../constants');

class RangeError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_HTTP_INVALID_STATUS_CODE;
  }
}

module.exports = RangeError;
