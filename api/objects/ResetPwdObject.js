const validator = require("validator")
const ValidationError = require("../errors/validation")
const UserModel = require("../models/UserModel")
const { isExistent } = require("../helper/validation")

class ResetPwdObject {
  constructor({ email } = {}) {
    this.email = email
  }

  // Failed => Throw ValidationError
  // Success => Return ResetPwdObject
  async validate() {
    let errors = new Array()

    // email [required]
    if (this.email == null) {
      errors.push({
        field: "email",
        message: "Email can not be empty",
        value: this.email,
      })
    } else if (!validator.isEmpty(this.email)) {
      const _email = this.email.toLowerCase()
      if (!validator.isEmail(_email)) {
        errors.push({
          field: "email",
          message: "Email is not valid.",
          value: _email,
        })
      } else if (!(await isExistent(UserModel, { email: _email }))) {
        errors.push({
          field: "email",
          message: "Email does not exist.",
          value: _email,
        })
      }
    }

    // throw basic errors before compare current password
    if (errors.length > 0) {
      throw new ValidationError(errors)
    } else {
      return this
    }
  }

  static async validateNewPassword({ new_password, confirm_new_password } = {}) {
    let errors = new Array()

    if (!new_password) {
      errors.push({
        field: "new_password",
        message: "new_password can not be empty",
        value: new_password,
      })
    } else if(!validator.isLength(new_password, { min: 4, max: 255 })) {
        errors.push({
          field: "new_password",
          message: "Must be from 4 to 255 characters.",
          value: new_password,
        })
    }

    if (!confirm_new_password) {
      errors.push({
        field: "confirm_new_password",
        message: "confirm_new_password can not be empty",
        value: confirm_new_password,
      })
    } else if (!validator.equals(new_password, confirm_new_password)) {
      errors.push({
        field: "confirm_new_password",
        message: "Confirm password must match with the password.",
        value: {
          new_password: new_password,
          confirm_new_password: confirm_new_password,
        },
      })
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }else {
      return true
    }
  }
}

module.exports = ResetPwdObject
