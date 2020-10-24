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

      throw new TypeError("email or confirmString is not valid.")
    } catch (error) {
      if (error instanceof TypeError) {
        throw new TypeError (error)
      } else {
        throw new Error(error)
      }
    }
  }
}

module.exports = ConfirmEmailObject
