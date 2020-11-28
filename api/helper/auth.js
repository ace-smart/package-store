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

  // @desc    Authenticate user
  // Args:    { username, password }
  // Return:  Authenticated => { user }
  //          Not Authenticated => False
  isAuthenticatedUser: async ({ ...user } = {}) => {
    if (JSON.stringify(user) === "{}") return false

    try {
      const userFromDb = await User.findOne({ username: user.username }).lean()
      if (userFromDb) {
        // Check status
        if (userFromDb.status === "activated") {
          // Check password
          const matchedPwd = await bcrypt.compare(user.password, userFromDb.password)
          if (matchedPwd) return userFromDb
        } else return { message: "Not activated" }
      }
      return false
    } catch (error) {
      return error.message
    }
  },

  //@desc:    Middleware for checking 'admin' role
  //Return:   req.user = {user}
  _ensureAdminRole: (req, res, next) => {
    if (
      typeof req.user !== "undefined" &&
      req.user.role != null &&
      req.user.role.toLowerCase() === "admin"
    ) {
      return next()
    }

    return ErrorHandler.sendErrors(res, new ForbiddenError())
  },
}
