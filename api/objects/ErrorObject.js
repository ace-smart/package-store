class ErrorObject {
  constructor({ statusCode, error } = {}) {
    if (statusCode != null && statusCode < 400) {
      throw new TypeError("[ErrorObject] statusCode must be greater than 400")
    }
    this.statusCode = statusCode
    this.error = error
  }

  static sendServerError() {
    return new ErrorObject({
      statusCode: 500,
      error: {
        name: 'ServerError',
        message:  "An error has occurred from the server!"
      }
    })
  }

  static sendInvalidationError({name, message, invalidation}) {
    return new ErrorObject({
      statusCode: 400,
      error: {name, message, invalidation}
    })
  }
  
  static sendNotFoundError({name, message}) {
    return new ErrorObject({
      statusCode: 404,
      error: {name, message}
    })
  }

  static sendTokenError({name, message}) {
    return new ErrorObject({
      statusCode: 401,
      error: {name, message}
    })
  }

  static sendForbiddenError({name, message}) {
    return new ErrorObject({
      statusCode: 403,
      error: {
        name: "ForbiddenError", 
        message: "Not allowed to access."
      }
    })
  }
}

module.exports = ErrorObject
