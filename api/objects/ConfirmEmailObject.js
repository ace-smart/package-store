const NotFoundError = require('../errors/not_found')
const {isExistent} = require('../helper/validation')
const UserModel = require('../models/UserModel')

class ConfirmEmailObject {
  constructor({ email, confirmString } = {}) {
    this.email = email
    this.confirmString = confirmString
  }

  async validate() {
    if (this.email == null) {
      throw new TypeError('email is not valid.')
    }

    if (this.confirmString == null)  {
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
