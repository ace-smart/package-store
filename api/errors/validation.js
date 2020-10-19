class ValidationError extends Error {
  constructor(errors = [], ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }

    // ---- EXAMPLE ----
    /* === ERROR RESPONSE ===
      errors [
        {
          field: 'username',
          message: 'Username can not have special characters',
          value: 'user!@#'
        }, 
        {
          field: 'email',
          message: 'Invalid email',
          value: 'exampleEmail@@1.ss'
        },
      ]
    */
    this.name = "ValidationError"
    this.message = "Validation failed."
    this.validation = errors
  }
}

module.exports = ValidationError
