const validator = require("validator")
const ProfileModel = require("../models/ProfileModel")
const ValidationError = require("../errors/validation")
const MongooseError = require("mongoose").Error
const { isExistent } = require("../helper/validation")
const {toFormatDateStr} = require('../helper/format')
const UserObject = require("./UserObject")
const ObjectError = require("../errors/object")
const PROFILE_GENDER_VALUES = ["male", "female", "lgbt"]
const STATUS_VALUES = ["deactivated", "activated"]

class ProfileObject {
  constructor({ _id, firstName, lastName, gender, dateOfBirth, phoneNumber, avatar } = {}) {
    this.id = _id
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.dateOfBirth = dateOfBirth
    this.phoneNumber = phoneNumber
    this.avatar = avatar
  }

  // === GET & SET ===
  set setAvatar(base64Str) {
    this.avatar = base64Str
  }

  get getAvatar() {
    return this.avatar
  }

  // @desc:       Get profile
  // Existed:     => return ProfileObject
  // Not Existed  => return null
  static async getProfile(profileId = null) {
    if (profileId != null) {
      try {
        const profile = await ProfileModel.findOne({ _id: profileId }).lean()
        if (profile) {
          return new ProfileObject({ ...profile })
        }
      } catch (error) {
        if (error instanceof MongooseError && error.kind === "ObjectId") {
          throw new Error("Id is not valid.")
        } else {
          throw new Error(error)
        }
      }
    }

    return null
  }

  validate(type = "create") {
    let errors = new Array()

    if (type === "create") {
      if (this.firstName == null) {
        errors.push({
          field: "firstName",
          message: "firstName must be required",
        })
      }
      if (this.lastName == null) {
        errors.push({
          field: "lastName",
          message: "lastName must be required",
        })
      }
      if (this.gender == null) {
        errors.push({
          field: "gender",
          message: "gender must be required",
        })
      }
      if (this.dateOfBirth == null) {
        errors.push({
          field: "dateOfBirth",
          message: "dateOfBirth must be required",
        })
      }
      if (this.phoneNumber == null) {
        errors.push({
          field: "phoneNumber",
          message: "phoneNumber must be required",
        })
      }
      
      // has errors
      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // Validate after being filled
    // === firsName ===
    if (this.firstName != null && !validator.isEmpty(this.firstName)) {
      if (!validator.isAlpha(this.firstName)) {
        errors.push({
          field: "firstName",
          message: "Must be alphabetic characters.",
          value: this.firstName,
        })
      }
      if (!validator.isLength(this.firstName, { min: 3, max: 30 })) {
        errors.push({
          field: "firstName",
          message: "Must be from 3 to 30 characters.",
          value: this.firstName,
        })
      }
    }
    // === lastName ===
    if (this.lastName != null && !validator.isEmpty(this.lastName)) {
      if (!validator.isAlpha(this.lastName)) {
        errors.push({
          field: "lastName",
          message: "Must be alphabetic characters.",
          value: this.lastName,
        })
      }
      if (!validator.isLength(this.lastName, { min: 3, max: 30 })) {
        errors.push({
          field: "lastName",
          message: "Must be from 3 to 30 characters.",
          value: this.lastName,
        })
      }
    }
    // === gender ===
    if (this.gender != null && !validator.isEmpty(this.gender)) {
      if (!validator.isAlpha(this.gender)) {
        errors.push({
          field: "gender",
          message: "Must be alphabetic characters.",
          value: this.gender,
        })
      }
      if (!validator.isIn(this.gender.toLowerCase(), PROFILE_GENDER_VALUES)) {
        errors.push({
          field: "gender",
          message: "Only accepts [male, female, lgbt]",
          value: this.gender,
        })
      }
    }
    // === dateOfBirth ===
    if (this.dateOfBirth != null && !validator.isEmpty(this.dateOfBirth)) {
      if (!validator.isDate(this.dateOfBirth)) {
        errors.push({
          field: "dateOfBirth",
          message: "Must be in format [YYYY/MM/DD]",
          value: this.dateOfBirth,
        })
      }
      if (
        !validator.isBefore(
          this.dateOfBirth,
          toFormatDateStr(new Date(new Date().getFullYear() - 16, 0, 1))
        )
      ) {
        errors.push({
          field: "dateOfBirth",
          message: "Must be over 16 years old",
          value: this.dateOfBirth,
        })
      }
    }
    // === phoneNumber ===
    if (this.phoneNumber != null && !validator.isEmpty(this.phoneNumber)) {
      if (!validator.isNumeric(this.phoneNumber)) {
        errors.push({
          field: "phoneNumber",
          message: "Must be numeric characters.",
          value: this.phoneNumber,
        })
      }
    }
    // === status ===
    if (this.status != null && !validator.isEmpty(this.status)) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Not valid.",
          value: this.status,
        })
      }
    }
    
    if (errors.length > 0) {
      throw new ValidationError(errors)
    } else {
      return this
    }
  }

  static async create(userId = null, profileData = {}) {
    if (!userId) {
      throw new TypeError('userId can not be undefined or null')
    }
    

    try {
      if (!(profileData instanceof ProfileObject)) {
        const profileObject = new ProfileObject({...profileData})
        profileObject.validate('create')
      } else {
        profileData.validate('create')
      }

      const profile = await ProfileModel.create(profileData)
      const userObject = new UserObject({_id: userId})
      userObject.setProfileId = profile._id
      const isUpdated = await userObject.save()
      if (isUpdated) {
        return new ProfileObject({...profile})
      }

      throw new Error("Failed to create profile.")
    } catch (error) {
      throw new Error(error)
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        name: 'ProfileObject',
        message: "Id is not valid",
        instance: this
      })
    }

    try {
      return await ProfileModel.findOneAndUpdate({ _id: this.id }, this)
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        name: 'ProfileObject',
        message: "Id is not valid",
        instance: this
      })
    }

    try {
      return await ProfileModel.findOneAndDelete({_id: this.id})
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ProfileObject
