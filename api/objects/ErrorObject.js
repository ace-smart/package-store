class ErrorObject {
  constructor({ statusCode, data } = {}) {
    if (statusCode != null && statusCode < 400) {
      throw new Error("[ErrorObject] statusCode must be greater than 400")
    }
    this.statusCode = statusCode
    // this.message = message
    this.data = data
  }

  // get getErrorObject() {
  //   return this
  // }

  // static isErrorObject(object) {
  //   if (object instanceof ErrorObject) {
  //     return true
  //   }

  //   return false
  // }

  static sendServerError(error) {
    const msg = (error != null) ? error : {message: "An error occurred from the server."}
    return new ErrorObject({
      statusCode: 500,
      data: {
        error:  msg
      }
    })
  }

  static sendInvalidInputError(errors) {
    return new ErrorObject({
      statusCode: 400,
      data: {errors: errors}
    })
  }

  static sendTokenError(error) {
    return new ErrorObject({
      statusCode: 401,
      data: {error: error},
    })
  }
}

module.exports = ErrorObject
