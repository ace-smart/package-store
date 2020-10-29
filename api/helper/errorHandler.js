const ErrorObject = require('../objects/ErrorObject')
const ValidationError = require('../errors/validation')
const NotFoundError = require('../errors/not_found')
const TokenError = require('../errors/token')
const ForbiddenError = require('../errors/forbidden')
const MongooseError = require('mongoose').Error

const ErrorHandler = {
  sendErrors: (res, error) => {
    if (error instanceof ValidationError) {
      return res.status(400).json(ErrorObject.sendInvalidationError(error))
    }
    if (error  instanceof NotFoundError) {
      return res.status(404).json(ErrorObject.sendNotFoundError(error))
    }
    if (error instanceof TokenError) {
      return res.status(401).json(ErrorObject.sendTokenError(error))
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).json(ErrorObject.sendForbiddenError(error))
    }
    // Server error
    return res.status(500).json(ErrorObject.sendServerError())
  }
}

module.exports = ErrorHandler