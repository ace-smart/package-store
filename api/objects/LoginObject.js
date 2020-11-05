const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const ValidationError = require("../errors/validation")
const UserObject = require("./UserObject")

class LoginObject {
  constructor({ username, password } = {}) {
    this.username = username
    this.password = password
  }

  // Error: => return ErrorObject
  // Valid: => return UserObject
  async authenticate(role = null) {
    let errors = new Array()
    if (this.username == null) {
      errors.push({
        field: "username",
        message: "Username can not be empty"
      })
    }
    if (this.password == null) {
      errors.push({
        field: "password",
        message: "Password can not be empty"
      })
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    try {
      const userObject = await UserModel.findOne({ username: this.username }).lean()
      if (userObject != null) {
        // Wrong password
        if (!(await bcrypt.compare(this.password, userObject.password))) {
          errors.push({
            field: "password",
            message: "Incorrect password.",
            value: this,
          })
          throw new ValidationError(errors)
        }
        // Doest not have 'activated' status
        if (userObject.status != null && userObject.status !== "activated") {
          errors.push({
            message: "The account is not activated",
            value: this,
          })
          throw new ValidationError(errors)
        }
        // Role is not allowed
        if (role != null && userObject.role !== role) {
          errors.push({
            message: "The account is not allowed to access.",
            value: this,
          })
          throw new ValidationError(errors)
        }

        const user = new UserObject({...userObject})
        user.setRefreshSecret = userObject.refresh_secret
        user.setAccessToken = userObject.accessToken
        user.setRefreshToken = userObject.refreshToken
        return user
      } else {
        // No username found
        errors.push({
          field: "username",
          message: "Username is not existent",
          value: this,
        })
        throw new ValidationError(errors)
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = LoginObject
