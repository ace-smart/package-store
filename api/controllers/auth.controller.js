const ErrorObject = require("../objects/ErrorObject")
const UserObject = require("../objects/UserObject")
const TokenObject = require("../objects/TokenObject")
const LoginObject = require("../objects/LoginObject")
const RegisterObject = require("../objects/RegisterObject")
const ConfirmEmailObject = require("../objects/ConfirmEmailObject")
const ValidationError = require("../errors/validation")
const TokenError = require("../errors/token")
const mailer = require("../helper/mailer")
const registerTemplate = require("../../email_templates/register")
const ObjectError = require("../errors/object")
const ResetPwdObject = require("../objects/ResetPwdObject")

module.exports = {
  // @desc    Authenticate
  // @route   POST /auth
  auth: async (req, res) => {
    try {
      const loggedUser = await new LoginObject({ ...req.body }).authenticate()
      const isInitialized = loggedUser.initializeTokens() // regenerate tokens
      if (isInitialized) {
        await loggedUser.save()
        return res.status(200).json({ user: loggedUser })
      }

      throw new Error("Authentication failed.")
    } catch (error) {
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
          message: "Given refresh token is not valid",
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
      const validation = await new RegisterObject({ ...req.body }).validate()
      const confirmString = require('crypto').randomBytes(64).toString('hex')
      const confirmEmailURL =
        req.protocol +
        "://" +
        req.get("host") +
        `/api/confirm-email?email=${validation.email}&confirmString=${confirmString}`
      const body = registerTemplate.setRegisterTemplate(
        { btnLink: confirmEmailURL, btnText: 'Confirm email address' })
      const mailResponse = await mailer.sendEmail(["phat.tran2905@gmail.com"], {
        subject: "EcommerceStore - Confirmation",
        htmlBody: body,
      })

      if (mailResponse.accepted.length > 0) {
        const user = await UserObject.create({ ...validation })
        user.setConfirmString = confirmString
        const isUpdated = await user.save()
        if (isUpdated) {
          return res.sendStatus(201)
        }
      }

      return res.status(400).json({
        error: { message: "Failed to send confirm email. Please request to send a new one." },
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },

  // @desc    Resend confirm email
  // @route   POST /resend-confirm-email
  resendConfirmEmail: async (req, res) => {
    /*  req.body = {email} */
    try {
      const user = await UserObject.getOneUserBy({ email: req.body.email })
      if (user && user.getStatus === "pending") {
        const confirmEmailURL =
          req.protocol +
          "://" +
          req.get("host") +
          `/api/confirm-email?email=${user.email}&confirmString=${user.confirmString}`

        const body = registerTemplate.setRegisterTemplate(
          { btnLink: confirmEmailURL, btnText: 'Confirm email address' } )
        const mailResponse = await mailer.sendEmail(["phat.tran2905@gmail.com"], {
          subject: "EcommerceStore - Confirmation",
          htmlBody: body,
        })

        if (mailResponse.accepted.length > 0) {
          return res.sendStatus(200)
        } else {
          return res.status(400).json({
            error: {
              message: "Failed to send confirm email. Please request another confirm email.",
            },
          })
        }
      } else {
        return res
          .status(400)
          .json({
            error: {
              message: "The email was already confirmed. Can not request to confirm again.",
            },
          })
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },


  // @desc    Email confirmation
  // @route   GET /confirm-email?email=email@exmaple.com&confirmString=12345qwerty
  confirmEmail: async (req, res) => {
    /*  req.query = {
      email: 'email@exmaple.com',
      confirmString: '12345qwerty'
    } */
    try {
      const validation = await new ConfirmEmailObject({ ...req.query }).validate()
      let user = await UserObject.getOneUserBy({
        email: validation.email,
        confirmString: validation.confirmString,
      })
      if (user && user.getStatus === "pending") {
        const isUpdated = await user.update({ status: "activated", confirmString: null })
        if (isUpdated) {
          return res.sendStatus(204)
        } else {
          throw new Error("Failed to send confirm email. Please request another confirm email.")
        }
      }
    } catch (error) {
      if (error instanceof ObjectError) {
        return res.status(404).json(error.message)
      }
      if (error instanceof TypeError) {
        return res
          .status(404)
          .json({ error: { message: "The link does not exist. Failed to activate." } })
      }

      return res.status(500).json(ErrorObject.sendServerError())
    }
  },

  // @desc    Send email to reset password
  // @route   POST /reset-password
  sendEmailForResetPWd: async (req, res) => {
    /*  req.body = {
      email: 'email@exmaple.com'
    } */
    try {
      const validation = await new ResetPwdObject({ ...req.body }).validate()
      let user = await UserObject.getOneUserBy({ email: validation.email })
      if (user && user.getStatus === "activated") {
        user.setConfirmString = require("crypto").randomBytes(64).toString("hex")
        const isUpdated = await user.save()
        if (isUpdated) {
          const confirmEmailURL =
            req.protocol +
            "://" +
            req.get("host") +
            `/api/reset-password?email=${isUpdated.email}&confirmString=${isUpdated.confirmString}`

          const body = registerTemplate.setRegisterTemplate(
            { btnLink: confirmEmailURL, btnText: 'Reset password' })
          const mailResponse = await mailer.sendEmail(["phat.tran2905@gmail.com"], {
            subject: "EcommerceStore - Reset password",
            htmlBody: body,
          })

          if (mailResponse.accepted.length > 0) {
            return res.sendStatus(201)
          } else {
            return res.status(400).json({
              error: { message: "Failed to send reset password email. Please request a new one." },
            })
          }
        }
      }

      // not confirmed
      if (user.getStatus === "pending") {
        return res.status(400).json({
          error: {
            email: req.body.email,
            message: "Your account email is not confirmed. The request is not allowed.",
          },
        })
      }

      // already requested
      if (user.getStatus === "reset password") {
        return res.status(400).json({
          error: {
            email: req.body.email,
            message: "An email was already sent. Please check your email.",
          },
        })
      }

      // deactivated
      if (user.getStatus === "deactivated") {
        return res.status(400).json({
          error: {
            email: req.body.email,
            message: "Your account is not activated. The request is not allowed.",
          },
        })
      }

      throw new Error("Failed to send reset password email.")
    } catch (error) {
      if (error instanceof ObjectError) {
        return res.status(404).json(error.message)
      }
      if (error instanceof TypeError) {
        return res
          .status(404)
          .json({ error: { message: "The link does not exist. Failed to activate." } })
      }
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      }

      return res.status(500).json(ErrorObject.sendServerError())
    }
  },

  // @desc    Change status to 'reset password' for being ready to set a new password
  // @route   GET /reset-password?email=email@exmaple.com&confirmString=12345qwerty
  resetPassword: async (req, res) => {
    /*  req.query = {
      email: 'email@exmaple.com',
      confirmString: '12345qwerty'
    } */
    try {
      const validation = await new ConfirmEmailObject({ ...req.query }).validate()
      let user = await UserObject.getOneUserBy({
        email: validation.email,
        confirmString: validation.confirmString,
      })

      if (user && user.getStatus === "activated") {
        const isUpdated = await user.update({ status: "reset password"})
        if (isUpdated) {
          return res.sendStatus(204)
        }
      } else if (user.getStatus === 'reset password') {
        return res.status(400).json({error: {message: 'The account has already reset password. Please set a new password.'}})
      }

      throw new Error("Failed to reset password.")
    } catch (error) {
      if (error instanceof ObjectError) {
        return res.status(404).json(error.message)
      }
      if (error instanceof TypeError) {
        return res
          .status(404)
          .json({ error: { message: "The link does not exist. Failed to activate." } })
      }

      return res.status(500).json(ErrorObject.sendServerError())
    }
  },

  // @desc    Set a new password
  // @route   PUT /reset-password?email=email@exmaple.com&confirmString=12345qwerty
  updateNewPassword: async (req, res) => {
    /*  === EXAMPLE ===
        req.query = {
          email: 'email@exmaple.com',
          confirmString: '12345qwerty'
        },
        req.body = {
          new_password: '1234',
          confirm_new_password: '12345'
        }
    */
    try {
      const validation = await new ConfirmEmailObject({ ...req.query }).validate()
      let user = await UserObject.getOneUserBy({
        email: validation.email,
        confirmString: validation.confirmString,
      })

      if (user && user.getStatus === "reset password") {
        console.log(req.body)
        const isValidPassword = await ResetPwdObject.validateNewPassword({...req.body})
        if (isValidPassword) {
          const bcrypt = require('bcrypt')
          const isUpdated = await user.update(
            { 
              status: "activated", 
              confirmString: null,
              password: await bcrypt.hash(req.body.new_password,await bcrypt.genSalt())
            })

          if (isUpdated) {
            return res.sendStatus(204)
          }
        }
      }

      throw new Error("Failed to set new password.")
    } catch (error) {
      if (error instanceof ValidationError){
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      }
      if (error instanceof ObjectError) {
        return res.status(404).json(error.message)
      }
      if (error instanceof TypeError) {
        return res
          .status(404)
          .json({ error: { message: "The link does not exist. Failed to activate." } })
      }

      return res.status(500).json(ErrorObject.sendServerError())
    }
  },

  // @desc:   Logout to reset both accessToken and refreshToken
  // @route:  POST /token/reset
  resetToken: async (req, res) => {
    try {
      const userObject = await UserObject.getDataByToken("access", req.user.accessToken)
      const isUpdated = await userObject.update({ accessToken: null, refreshToken: null })
      if (isUpdated) {
        return res.sendStatus(204)
      }

      return res.status(400).json({ error: { message: "Failed to reset token." } })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },
}
