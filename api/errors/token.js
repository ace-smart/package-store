const { token } = require("morgan")

class TokenError extends Error {
  constructor ({name, message, expiredAt}, ...params) {
    super(...params)

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenError)
    }

    // === EXAMPLE ===
    //  TokenError: {
    //    name: 'TokenExpiredError',
    //    message: 'jwt expired',
    //    expiredAt: '11/1/2020'
    //  }
    //
    // Names of token's types:
    //  -- MissingTokenError 
    //  -- InvalidTokenError
    //  -- (from JWT) [TokenExpiredError, JsonWebTokenError, NotBeforeError]

    this.name = (name == null) ? 'TokenError' : name
    this.message = message
    if (expiredAt != null) {
      this.expiredAt = expiredAt
    }
  }
}

module.exports = TokenError