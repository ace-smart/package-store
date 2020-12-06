const bcrypt = require("bcrypt")
const UserModel = require("../models/UserModel")
const validator = require("validator")
const TokenObject = require("./TokenObject")
const AddressObject = require('./AddressObject')
const { isExistent } = require("../helper/validation")
const TokenError = require("../errors/token")
const ObjectError = require("../errors/object")
const ValidationError = require("../errors/validation")
const NotFoundError = require("../errors/not_found")
const ProfileObject = require("./ProfileObject")
const USER_ROLES = ["user", "admin"]
const STATUS_VALUES = ["deactivated", "activated", "pending", "reset password"]

class UserObject {
  constructor({
    _id,
    username,
    email,
    password,
    addressId,
    status,
    role,
    confirmString,
    createdAt,
    profileId,
  } = {}) {
    this.id = _id
    this.username = username
    this.email = email
    this.password = password
    this.addressId = addressId
    this.role = role
    this.confirmString = confirmString
    this.status = status
    this.createdAt = createdAt
    this.profileId = profileId
  }

  // ==== GET & SET ====
  set setAccessToken(accessToken) {
    this.accessToken = accessToken
  }

  get getAccessToken() {
    return this.accessToken
  }

  set setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken
  }

  get getRefreshToken() {
    return this.refreshToken
  }

  set setRefreshSecret(refresh_secret) {
    this.refresh_secret = refresh_secret
  }

  get getRefreshSecret() {
    return this.refresh_secret
  }

  set setStatus(status) {
    this.status = status
  }

  get getStatus() {
    return this.status
  }

  set setProfileId(profileId) {
    this.profileId = profileId
  }

  get getProfileId() {
    return this.profileId
  }

  async setProfile() {
    if (this.profileId instanceof Object) {
      // populated
      this.profile = new ProfileObject({...this.profileId})
      this.profileId = this.profile.id.toString()
    } else if (typeof this.profileId === 'string') {
      // existed
      this.profile = await ProfileObject.getOneProfileById(this.profileId)
    } else {
      this.profile = null
    }
  }

  set setConfirmString(confirmString) {
    this.confirmString = confirmString
  }

  get getConfirmString() {
    return this.confirmString
  }

  async setAddress() {
    if (this.addressId instanceof Object) {
      // populated
      this.address = new AddressObject({...this.addressId})
      this.addressId = this.address.id.toString()
    } else if (typeof this.addressId === 'string') {
      // existed
      this.address = await AddressObject.getOneAddressById(this.addressId)
    } else {
      this.address = null
    }
  }
  
  // @desc:     Get profileId by Id
  static async getProfileIdById(userId = null) {
    if (!userId) {
      throw new TypeError("userId can not be null or undefined.")
    }
    if (!(await isExistent(UserModel, { _id: userId }))) {
      throw new ObjectError({
        objectName: "UserObject",
        errorProperty: 'Id',
        message: "Id is not valid",
      })
    }

    try {
      const user = await UserModel.findOne({ _id: userId }).lean()
      if (user) {
        return user.profileId
      }

      return null
    } catch (error) {
      throw error
    }
  }

  // @desc:     Get addresses by Id
  static async getAddressById(userId = null) {
    if (!userId) {
      throw new TypeError("userId can not be null or undefined.")
    }
    if (!(await isExistent(UserModel, { _id: userId }))) {
      throw new ObjectError({
        objectName: "UserObject",
        errorProperty: 'Id',
        message: "Id is not valid",
      })
    }

    try {
      const user = await UserModel.findOne({ _id: userId }).lean()
      if (user) {
        return user.addressId
      }

      return null
    } catch (error) {
      throw error
    }
  }

  // @desc:     Get user by criteria
  // @return:   UserObject
  static async getOneUserBy(criteria = {}, selectFields = null) {
    try {
      const user = await UserModel.findOne(criteria, selectFields)
      .populate({path: 'profileId'})
      .populate({path: 'addressId'}).lean()
      
      if (user) {
        const userObject = new UserObject({ ...user })
        await userObject.setProfile()
        await userObject.setAddress()
        // Avoid showing tokens
        delete userObject.accessToken
        delete userObject.refreshToken
        // delete userObject.refresh_secret

        return userObject
      }

      return null
    } catch (error) {
      throw error
    }
  }

  // @desc:     Get list of users by criteria
  // @return:   UserObject[]
  static async getUsersBy(criteria = {}, selectFields = null) {
    try {
      const listOfUsers = await UserModel.find(criteria, selectFields).lean()
      if (listOfUsers.length > 0) {
        let userObjects = new Array()
        listOfUsers.forEach((element) => {
          const object = new UserObject({ ...element })
          // object.clean()
          // Avoid showing tokens
          delete object.accessToken
          delete object.refreshToken
          // delete object.refresh_secret

          userObjects.push(object)
        })

        return userObjects
      }

      return null
    } catch (error) {
      throw error
    }
  }

  // @fields:   [username, email, password, role, status]
  // @return:   Failed  =>  {ErrorObject}
  //            Valid   =>  {UserObject}
  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    // === CREATE === ----------  Required fields
    if (type === "create") {
      if (this.username == null || validator.isEmpty(this.username.toString())) {
        errors.push({
          field: "username",
          message: "Must be required.",
        })
      }
      if (this.email == null || validator.isEmpty(this.email.toString())) {
        errors.push({
          field: "email",
          message: "Must be required.",
        })
      }
      if (this.password == null || validator.isEmpty(this.password.toString())) {
        errors.push({
          field: "password",
          message: "Must be required.",
        })
      }

      // has errors
      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // username   [required]
    if (this.username != null && !validator.isEmpty(this.username.toString())) {
      const _username = this.username.toLowerCase()
      if (!validator.isAlphanumeric(_username)) {
        errors.push({
          field: "username",
          message: "Must be only numbers and characters.",
          value: _username,
        })
      }
      if (!validator.isLength(_username.toString(), { min: 4, max: 255 })) {
        errors.push({
          field: "username",
          message: "Must be from 4 to 255 characters.",
          value: _username,
        })
      }
      if (await isExistent(UserModel, { username: _username }, exceptionId)) {
        errors.push({
          field: "username",
          message: "Username is already existent.",
          value: _username,
        })
      }
    }

    // email [required]
    if (this.email != null && !validator.isEmpty(this.email.toString())) {
      const _email = this.email.toString().toLowerCase()
      if (!validator.isEmail(_email)) {
        errors.push({
          field: "email",
          message: "Email is not valid.",
          value: _email,
        })
      }
      if (!validator.isLength(_email, { max: 255 })) {
        errors.push({
          field: "email",
          message: "Must be less than 256 characters.",
          value: _email,
        })
      }
      if (await isExistent(UserModel, { email: _email }, exceptionId)) {
        errors.push({
          field: "email",
          message: "Email is already existent.",
          value: _email,
        })
      }
    }

    // role
    if (this.role != null && !validator.isEmpty(this.role.toString())) {
      if (!USER_ROLES.find((element) => element === this.role.toLowerCase())) {
        errors.push({
          field: "role",
          message: "The value of the field 'role' is not valid.",
          value: this.role,
        })
      }
    }

    // status
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
      if (!STATUS_VALUES.find((element) => element === this.status.toLowerCase())) {
        errors.push({
          field: "status",
          message: "The value of the field 'status' is not valid.",
          value: this.status,
        })
      }
    }

    if (errors.length > 0) {
      // has errors
      throw new ValidationError(errors)
    } else {
      return this
    }
  }

  // @desc:     Remove undefined props and lowercase fields.
  clean() {
    let userObject = this
    const fieldsToClean = ["username", "email", "role", "status"]
    for (const [key, value] of Object.entries(userObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          userObject[key] = validator.trim(value.toString().toLowerCase())
        }
        
        if (key === 'updatedAt') {
          userObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete userObject[key]
      }
    }

    return userObject
  }

  // @desc:     Create a user
  // @fields:   [username, email, password, role, status]
  // @return:   UserObject
  static async create({ ...userData } = {}) {
    try {
      // Create profile
      if (userData.profile) {
        if (!ProfileObject.hasEmptyProfileData(userData.profile)) {
          const createdProfile = await ProfileObject.create({...userData.profile})
          userData.profileId = createdProfile.id.toString()
        } else {
          delete userData.profile
        }
      }

      // Create user
      let userObject = new UserObject({ ...userData })
      const validation = await userObject.validate()
      if (validation) {
        userObject = userObject.clean()
        userObject.password = await bcrypt.hash(userData.password, await bcrypt.genSalt())
        userObject.setStatus = "pending"
        const createdUser = await UserModel.create({...userObject})
        if (createdUser){
          return new UserObject({...createdUser._doc})
        }
      }

      throw new Error("Failed to create user.")
    } catch (error) {
      throw error
    }
  }

  // @desc:     Create user with 3rd party account
  static async createWith3rdPartyAcc ({...userData}) {
    try {
      // Create profile
      const createdProfile = await ProfileObject.create({...userData.profile})
      userData.profileId = createdProfile.id.toString()
      // Set properties
      let userObject = new UserObject({ ...userData }) 
      userObject = userObject.clean()
      userObject.setStatus = "activated"
      userObject.clientId = userData.clientId
      userObject.provider = userData.provider
      // Create user
      const createdUser = await UserModel.create({...userObject})
      if (createdUser){
        const newUser = new UserObject({...createdUser._doc})
        newUser.setRefreshSecret = createdUser._doc.refresh_secret
        const isInitialized = newUser.initializeTokens()
        if (isInitialized) {
          await newUser.save()
          return newUser
        }
      } else {
        throw new Error("Failed to create user.")
      }

    } catch (error) {
      throw error
    }
  }

  // @desc:     Update
  // @return:   <Boolean> True
  async update({...userData}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'UserObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }

    if (!(await isExistent(UserModel, {_id: this.id}))){
      throw new ObjectError({
        objectName: 'UserObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }
    
    try {
      // [Create/Update] address
      if (userData.address) {
        if (!AddressObject.hasEmptyAddressData(userData.address)) {
          if (userData.address.id == null) {
            // Create
            const createdAddress = await AddressObject.create({...userData.adress})
            userData.address.id = createdAddress.id.toString()
          } else {
            // Update
            const address = await AddressObject.getOneAddressById(userData.adress.id)
            if (address) {
              await address.update({...userData.address})
            }
          }
        }else {
          delete userData.address
        }
      } 

      // [Create/Update] profile
      if (userData.profile) {
        if (!ProfileObject.hasEmptyProfileData(userData.profile)) {
          if(userData.profile.id == null) {
            const createdProfile = await ProfileObject.create({...userData.profile})
            userData.profileId = createdProfile.id.toString()
          } else {
            const profile = await ProfileObject.getOneProfileById(userData.profile.id)
            await profile.update({...userData.profile})
          }
        } else {
          delete userData.profile
        }
      }

      let userObject = new UserObject({ ...userData })
      const validation = await userObject.validate("update", this.id)
      if (validation) {
        userObject = userObject.clean()
        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: this.id }, {...userObject}, { new: true })
        return new UserObject({...updatedUser})
      }

      throw new Error("Failed to update.")
    } catch (error) {
      throw error
    }
  }

  async resetTokens () {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'UserObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }

    if (!(await isExistent(UserModel, {_id: this.id}))){
      throw new ObjectError({
        objectName: 'UserObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }

    try {
      const isUpdated = await UserModel.findOneAndUpdate({_id: this.id}, {accessToken: null, refreshToken: null}, {new: true})
      if (isUpdated) {
        return isUpdated
      }

      throw new Error("Failed to reset tokens")
    } catch (error) {
      throw error
    }
  }

  // @desc:     Get user by a token
  // @return:   UserObject
  static async getDataByToken(type = null, token = null) {
    if (!type) {
      throw new TypeError("Type can not be null or undefined.")
    } else if (typeof type !== "string") {
      throw new TypeError("Type must be a string.")
    } else if (type !== "access" && type !== "refresh") {
      throw new TypeError(`Type '${type}' is not valid.`)
    }

    if (token == null) {
      throw new TypeError("Can not get data with a null or undefined token.")
    }

    let condition = null
    if (type === "access") {
      condition = { accessToken: token }
    } else if (type === "refresh") {
      condition = { refreshToken: token }
    }

    if (condition == null) {
      throw new TypeError("Can not get data with unknown type")
    }

    if (condition != null && token != null) {
      try {
        const user = await UserModel.findOne({ ...condition })
        .populate({path: 'profileId'})
        .populate({path: 'addressId'}).lean()
        if (user != null) {
          const userObject = new UserObject({ ...user })
          userObject.setRefreshSecret = user.refresh_secret
          userObject.setAccessToken = user.accessToken
          userObject.setRefreshToken = user.refreshToken
          await userObject.setProfile()
          await userObject.setAddress()
          
          return userObject
        }
        // No user found => token is not valid
        throw new NotFoundError("No user found.")
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw new TokenError({
            name: "InvalidTokenError",
            message: "Token is not valid.",
          })
        }
        throw error
      }
    }
  }

  // @desc:   Initialize tokens if necessary
  // accessToken:   (token == null) || (expired) => Generate
  // refreshToken:  (token == null)  =>  Generate
  initializeTokens() {
    const token = new TokenObject()
    try {
      token.setPayload = { ...this }
      
      if (this.refreshToken == null) {
        this.refreshToken = token.generateToken("refresh", this.refresh_secret)
      }

      if (this.accessToken == null) {
        this.accessToken = token.generateToken("access")
      } else {
        // Invoke to catch expiration error
        TokenObject.verifyToken("access", this.accessToken)
      }
    } catch (error) {
      if (error instanceof TokenError) {
        if (error.name === "TokenExpiredError") {
          this.accessToken = token.generateToken("access")
        }
      } else {
        throw error
      }
    }

    return true
  }

  // @return:   void
  async save() {
    const userToSave = this.clean()
      try {
        if (this.id != null) {
          const updatedUser = new UserObject(
            await UserModel.findOneAndUpdate(
              { _id: this.id },
              { ...userToSave },
              { new: true }
            ).lean()
          )

          return updatedUser
        }

        throw new ObjectError({
          objectName: "UserObject",
          errorProperty: 'Id',
          message: "Can not save object with undefined or null id."
        })
      } catch (error) {
        throw error
      }
  }

  // @return:   void
  async remove() {
    const userToRemove = this.clean()
      try {
        if (this.id != null) {
          const deletedUser = new UserObject(await UserModel.findOneAndDelete({ _id: userToRemove.id }))
          return deletedUser
        }

        throw new ObjectError({
          name: "UserObject",
          errorProperty: "Id",
          message: "Can not delete object with undefined or null id.",
        })
      } catch (error) {
        throw error
      }
    }
}

module.exports = UserObject
