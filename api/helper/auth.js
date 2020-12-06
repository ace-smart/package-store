const bcrypt = require("bcrypt")
const User = require("../models/UserModel")
const ErrorObject = require("../objects/ErrorObject")
const TokenObject = require("../objects/TokenObject")
const UserObject = require("../objects/UserObject")
const TokenError = require("../errors/token")
const ErrorHandler = require('../helper/errorHandler')
const ForbiddenError = require("../errors/forbidden")

module.exports = authHelper = {
  //@desc:    Middleware for checking access token
  //Return:   req.user = {user}
  _ensureAccessToken: async (req, res, next) => {
    const accessTokenHeader = req.header("Authorization")
    try {
      // No token attached
      if (accessTokenHeader == null) {
        throw new TokenError({
          name: "MissingTokenError",
          message: "Missing token."
        })
      } else {
        // ["Bearer", <tokenString>]
        const [BEARER, tokenString] = accessTokenHeader.split(" ")
        // Not a Bearer token
        if (BEARER !== "Bearer") {
          throw new TokenError({
            name: "InvalidTokenError",
            message: "The token must be a Bearer token."
          })
        }
        
        const payload = TokenObject.verifyToken("access", tokenString)
        const isExistent = await UserObject.getDataByToken('access', tokenString)
        if (isExistent instanceof UserObject){
          req.user = {
            ...payload, 
            accessToken: tokenString
          }
          return next()
        }
        
        throw new TokenError({
          name: 'InvalidTokenError',
          message: 'The token is not valid.'
        })
      }
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  //@desc:    Middleware for checking 'admin' role
  //Return:   req.user = {user}
  _ensureAdminRole: (req, res, next) => {
    if (req.user != null && req.user.role === "admin"
    ) {
      return next()
    }
    
    return ErrorHandler.sendErrors(res, new ForbiddenError())
  },
}
