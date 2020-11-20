const validator = require("validator")
const ValidationError = require("../errors/validation")
const UserObject = require("./UserObject")

class RegisterObject {
  constructor({ username, email, password, confirm_password } = {}) {
    this.username = username
    this.email = email
    this.password = password
    this.confirm_password = confirm_password
    this.role = undefined
    this.status = undefined
  }

  set setRole (role) {
    this.role = role
  }

  set setStatus (status) {
    this.status = status
  }

  // Failed => Throw ValidationError
  // Success => Return true
  async validate() {
    let errors = new Array()
    
    // [password] -- [required]
    if (this.password == null || validator.isEmpty(this.password.toString())) {
      errors.push({
        field: "password",
        message: "Must be required.",
      })
    } 
    // confirm_password -- [required]
    if (this.confirm_password == null || validator.isEmpty(this.confirm_password.toString())) {
      errors.push({
        field: "confirm_password",
        message: "Must be required.",
      })
    } 
    // throw empty errors
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    if (this.password != null && !validator.isEmpty(this.password.toString())) {
      if (!validator.isLength(this.password, { min: 4, max: 255 })) {
        errors.push({
          field: "password",
          message: "Must be from 4 to 255 characters.",
          value: {
            password: this.password,
            confirm_password: this.confirm_password,
          },
        })
      }
    }

    if (this.confirm_password != null && !validator.isEmpty(this.confirm_password.toString())) {
      if (!validator.equals(this.confirm_password, this.password)) {
        errors.push({
          field: "confirm_password",
          message: "Confirm password must match with password.",
          value: {
            password: this.password,
            confirm_password: this.confirm_password,
          },
        })
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    // Validate the fields of UserObject
    try {
      const isValidated = await (new UserObject({...this})).validate() 
      if (isValidated) {
        return this
      }

      throw new Error("Validation failed.")
    } catch (error) {
      throw error
    }
    
  }
}

module.exports = RegisterObject
