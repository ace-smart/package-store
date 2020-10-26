const validator = require("validator")
const ValidationError = require("../errors/validation")
const UserObject = require("./UserObject")
const bcrypt = require("bcrypt")

class ChangePwdObject {
  constructor({ id, password, new_password, confirm_new_password } = {}) {
    this.id = id
    this.password = password
    this.new_password = new_password
    this.confirm_new_password = confirm_new_password
  }

  // Failed => Throw ValidationError
  // Success => Return true
  async validate() {
    let errors = new Array()

    if (this.id == null) {
      throw new TypeError("Id is not valid")
    }
    if (this.password == null) {
      errors.push({
        field: "password",
        message: "Must be required.",
      })
    }
    if (this.new_password == null) {
      errors.push({
        field: "new_password",
        message: "Must be required.",
      })
    }
    if (this.confirm_new_password == null) {
      errors.push({
        field: "confirm_new_password",
        message: "Must be required.",
      })
    }
    // throw empty errors
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    if (typeof this.new_password !== "undefined" && !validator.isEmpty(this.new_password)) {
      if (!validator.isLength(this.new_password, { min: 4, max: 255 })) {
        errors.push({
          field: "new_password",
          message: "Must be from 4 to 255 characters.",
          value: {
            new_password: this.new_password,
            confirm_new_password: this.confirm_new_password,
          },
        })
      }
    }
    if (
      typeof this.confirm_new_password !== "undefined" &&
      !validator.isEmpty(this.confirm_new_password)
    ) {
      if (!validator.equals(this.confirm_new_password, this.new_password)) {
        errors.push({
          field: "confirm_new_password",
          message: "Confirm password must match with password.",
          value: {
            new_password: this.new_password,
            confirm_new_password: this.confirm_new_password,
          },
        })
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    // compare current password
    try {
      const user = await UserObject.getOneUserBy({ _id: this.id })
      if (user instanceof UserObject) {
        if (!(await bcrypt.compare(this.password, user.password))) {
          errors.push({
            field: "password",
            message: "Incorrect password.",
            value: {
              password: this.password,
            },
          })
          throw new ValidationError(errors)
        }
        return this
      }
      throw new Error("The user does not exist.")
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(error.validation)
      } else {
        throw new Error(error)
      }
    }
  }
}

module.exports = ChangePwdObject
