class TokenError extends Error {
  constructor (tokenError, ...params) {
    super(...params)

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenError)
    }

    // === EXAMPLE ===
    //  data: {
    //    name: 'TokenExpiredError',
    //    message: 'jwt expired',
    //    ...
    //  }
    //
    // Names of token's types:
    //  -- MissingTokenError
    //  -- InvalidTokenError
    //  -- (from JWT) [TokenExpiredError, JsonWebTokenError, NotBeforeError]

    this.name = 'TokenError'
    this.data = tokenError
  }
}

module.exports = TokenError