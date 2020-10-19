const validator = require("validator")
const ValidationError = require("../errors/validation")
const UserModel = require('../models/UserModel')
const {isExistent} = require('../helper/validation')

class ResetPwdObject {
  constructor({ email } = {}) {
    this.email = email
  }

  // Failed => Throw ValidationError
  // Success => Return true
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
      } else if (! (await isExistent(UserModel, { email: _email })) ) {
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
      return true
    }

  }
}

module.exports = ResetPwdObject
