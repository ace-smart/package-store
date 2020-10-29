const jwt = require("jsonwebtoken")
const PayloadError = require("../errors/payload")
const TokenError = require('../errors/token')
// const UserObject = require("./UserObject")

class TokenObject {
  constructor(token) {
    this.token = token
    this.payload = null
  }

  // === GET & SET ===
  set setToken(token) {
    this.token = token
  }

  get getToken() {
    return this.token
  }

  set setPayload({ id, username, status, role }) {
    if (id != null && username != null && status != null && role != null) {
      this.payload = {
        id: id,
        username: username,
        status: status,
        role: role,
      }
    } else {
      throw new PayloadError({ id, username, status, role })
    }
  }

  get getPayload() {
    return this.payload
  }

  //@desc:      Generate token
  //@args:      [<String> type, <String> refresh_secret, <Object> opts]
  //@return:    <String> token
  generateToken(type = null, refresh_secret = null, opts = {}) {
    if (!type) {
      throw new TypeError("Type can not be null or undefined.")
    } else if (typeof type !== 'string') {
      throw new TypeError("Type must be a string.")
    } else if (type !== 'access' && type !== 'refresh'){
      throw new TypeError(`Type '${type}' is not valid.`)
    }

    if (type === 'access') {
      opts.expiresIn = "1d"
    }
    if (type === 'refresh' && opts.expiresIn != null) {
      delete opts.expiresIn // no expiration day
    }

    if (this.payload != null) {
      let secretKey = null
      if (type === "access") {
        secretKey = process.env.ACCESSTOKEN_SECRET
      } else if (type === "refresh") {
          if (refresh_secret != null) {
            if (typeof refresh_secret !== 'string') {
              throw new TypeError(`refresh_secret must be a string.`)
            }
            secretKey = refresh_secret + process.env.REFRESHTOKEN_SECRET
          } else {
            throw new TypeError(`refresh_secret can not be null or undefined.`)
          }
      }
      
      try {
        return this.token = jwt.sign(this.payload, secretKey, opts)
      } catch (error) {
        throw new TokenError(error)
      }
      
    } else {
      throw new PayloadError({...this.payload})
    }
  }

  //@desc:      Verify token
  //@args:      [<String> type, <String> token, <String> refresh_secret, <Object> opts]
  //@return:    <Object> payload
  static verifyToken(type = null, token = null, refresh_secret = null, opts = {}) {
    if (!type) {
      throw new TypeError("Type can not be null or undefined.")
    } else if (typeof type !== 'string') {
      throw new TypeError("Type must be a string.")
    } else if (type !== 'access' && type !== 'refresh'){
      throw new TypeError(`Type '${type}' is not valid.`)
    }
    
    if (token != null) {
        let secretKey = null
        if (type === "access") {
          secretKey = process.env.ACCESSTOKEN_SECRET
        } else if (type === "refresh") {
          if (refresh_secret != null) {
            if (typeof refresh_secret !== 'string') {
              throw new TypeError(`refresh_secret must be a string.`)
            }
          
            secretKey = refresh_secret + process.env.REFRESHTOKEN_SECRET
          } else {
            throw new TypeError(`refresh_secret can not be null or undefined.`)
          }
        }

        try {
          return this.payload = jwt.verify(token, secretKey, opts)
        } catch (error) {
          throw new TokenError(error)
        }

    } else {
      throw new TypeError(`Can not verify with a null or undefined token.`)
    }
  }
}

module.exports = TokenObject
