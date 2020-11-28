const NotFoundError = require('../errors/not_found')
const {isExistent} = require('../helper/validation')
const UserModel = require('../models/UserModel')
const validator = require('validator')

class ConfirmEmailObject {
  constructor({ email, confirmString } = {}) {
    this.email = email
    this.confirmString = confirmString
  }

  async validate() {
    if (this.email == null || validator.isEmpty(this.email.toString())) {
      throw new TypeError('email is not valid.')
    }

    if (this.confirmString == null || validator.isEmpty(this.confirmString.toString()))  {
      throw new TypeError('confirmString is not valid.')
    }

    try {
      const isExistentObject = await isExistent(
      UserModel,
      {
        confirmString: this.confirmString,
        email: this.email,
      })
      
      if (isExistentObject) {
        return this
      }
      // not existent
      throw new NotFoundError("The link does not exist. Failed to activate.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = ConfirmEmailObject
