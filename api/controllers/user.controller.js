const UserObject = require("../objects/UserObject")
const RegisterObject = require('../objects/RegisterObject')
const ResetPwdObject = require("../objects/ResetPwdObject")
const ErrorHandler = require('../helper/errorHandler')
const NotFoundError = require("../errors/not_found")

module.exports = {
  // @desc:     Get all users
  // @route     GET /users
  // @return:   UserObject[]
  showUserList: async (req, res) => {
    try {
      const users = await UserObject.getUsersBy()
      if (users && users.length > 0) {
        return res.status(200).json(users)
      }

      throw new NotFoundError("No user found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get list of administrators
  // @route   GET /users/admins
  showAdminList: async (req, res) => {
    try {
      const selectFields = "username email status role confirmString createdAt profileId"
      const users = await UserObject.getUsersBy({ role: "admin" }, selectFields)
      if (users && users.length > 0) {
        return res.status(200).json(users)
      }

      throw new NotFoundError("No user found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show list of customers
  // @route   GET /users/customers
  showCustomerList: async (req, res) => {
    try {
      const selectFields = "username email status role confirmString createdAt profileId"
      const users = await UserObject.getUsersBy({ role: "user" }, selectFields)

      if (users && users.length > 0) {
        return res.status(200).json(users)
      }

      throw new NotFoundError("No user found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get user by Id
  // @route   GET /users/:id
  getUserById: async (req, res) => {
    try {
      const user = await UserObject.getOneUserBy({ _id: req.params.id })
      
      if (user) {
        return res.status(200).json(user)
      }
      // Not found
      throw new NotFoundError("No user found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new user
  // @route   POST /users
  createNewUser: async (req, res) => {
    try {
      let validation = await (new RegisterObject({ ...req.body })).validate()
      if (validation) {
        const user = await UserObject.create({...req.body})
        if (user) {
          return res.sendStatus(201)
        }
      }

      throw new Error("Failed to create new user.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update user
  // @route   PUT /users/:id
  updateUserById: async (req, res) => {
    try {
      const user = await UserObject.getOneUserBy({_id: req.params.id})
      const isUpdated = await user.update({ ...req.body })
      if (isUpdated) {
        return res.sendStatus(204)
      }

      throw new Error("Failed to update.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update user
  // @route   PUT /users/reset-password
  resetPasswordById: async (req, res) => {
    // req.body = {email}
    const mailer = require('../helper/mailer')
    const registerTemplate = require('../../email_templates/register')
    try {
      const validation = await (new ResetPwdObject({ ...req.body })).validate()
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
          const mailResponse = await mailer.sendEmail([req.body.email], {
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
      if (error instanceof TypeError) {
        return res
          .status(404)
          .json({ error: { message: "The link does not exist. Failed to activate." } })
      }

      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete user
  // @route   DELETE /users/:id
  removeUserById: async (req, res) => {
    try {
      const user = new UserObject({ _id: req.params.id })
      if (user) {
        const isRemoved = await user.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to remove user.")
      }

      throw new Error("No user found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
