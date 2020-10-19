const ErrorObject = require("../objects/ErrorObject")
const UserObject = require("../objects/UserObject")
const TokenObject = require("../objects/TokenObject")
const LoginObject = require("../objects/LoginObject")
const RegisterObject = require("../objects/RegisterObject")
const ValidationError = require("../errors/validation")
const TokenError = require("../errors/token")

module.exports = {
  // @desc    Authenticate
  // @route   POST /auth
  auth: async (req, res) => {
    try {
      const loggedUser = await (new LoginObject({ ...req.body })).authenticate()
      const isInitialized = loggedUser.initializeTokens() // regenerate tokens
      if (isInitialized) {
        await loggedUser.save()
        return res.status(200).json({ user: loggedUser })
      }

      throw new Error("Authentication failed.")
    } catch (error) {
      console.log(error)
      if (error instanceof TokenError) {
        // Failed to initialize tokens
        return res.status(401).json(ErrorObject.sendTokenError(error.data))
      } else if (error instanceof ValidationError) {
        // Validation failed
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        // Mongoose or other errors
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },

  // @desc:    Renew access token by refresh token
  // @route:   GET /token
  renewAccessToken: async (req, res) => {
    try {
      const refreshTokenHeader = req.header("x-refresh-token")
      if (typeof refreshTokenHeader === "undefined") {
        throw new TokenError({
          name: "MissingTokenError",
          message: "Missing refresh token",
        })
      }

      const [BEARER, refreshToken] = req.header("x-refresh-token").split(" ")
      // Not 'Bearer token'
      if (BEARER !== "Bearer" || typeof refreshToken === "undefined") {
        throw new TokenError({
          name: "InvalidTokenError",
          message: "Given refresh token is not valid"
        })
      }

      let userFromRT = await UserObject.getDataByToken("refresh", refreshToken)
      const token = new TokenObject()
      token.setPayload = { ...userFromRT }
      userFromRT.setAccessToken = token.generateToken("access")
      await userFromRT.save()
      return res.status(200).json({
        accessToken: userFromRT.getAccessToken,
      })

    } catch (error) {
      if (error instanceof TokenError) {
        return res.status(401).json(ErrorObject.sendTokenError(error.data))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },

  // @desc    Register
  // @route   POST /register
  register: async (req, res) => {
    /*  req.body = {username, password, email}
        default: role => "user", status => "deactivated"
    */
    try {
      const validation = await (new RegisterObject({ ...req.body })).validate()
      const user = await UserObject.create({...validation})
      return res.status(200).json({ user: user })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },

  // @desc:   Logout to reset both accessToken and refreshToken
  // @route:  POST /logout
  logout: async (req, res) => {
    try {
      const userObject = await UserObject.getDataByToken("access", req.user.accessToken)
      const isUpdated = await userObject.update(
          {accessToken: null, refreshToken: null})
      if (isUpdated) {
        return res.sendStatus(204)
      }

      throw new Error("Failed to logout.")
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },
}
