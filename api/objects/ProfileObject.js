const validator = require("validator")
const ProfileModel = require("../models/ProfileModel")
const ValidationError = require("../errors/validation")
const {toFormatDateStr, toCapitalize} = require('../helper/format')
const UserObject = require("./UserObject")
const ObjectError = require("../errors/object")
const PROFILE_GENDER_VALUES = ["male", "female", "lgbt"]
const STATUS_VALUES = ["deactivated", "activated"]
const {isExistent} = require('../helper/validation')

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
      try {
        if (profileId != null) {
          const profile = await ProfileModel.findOne({ _id: profileId }).lean()
          if (profile) {
            return new ProfileObject({ ...profile })
          }
        }

        return null
      } catch (error) {
        throw error
      }

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

  // @desc:     Remove undefined props and lowercase fields.
  clean() {
    let profileObject = this
    const fieldsToClean = ["firstName", "lastName", "gender", "status"]
    for (const [key, value] of Object.entries(profileObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if(key === 'firstName' || key === 'lastName') {
            profileObject[key] = toCapitalize(validator.trim(value.toString().toLowerCase()))
          }
          if(key === 'gender' || key === 'status') {
            profileObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }
        if (key === 'updatedAt') {
          profileObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete profileObject[key]
      }
    }

    return profileObject
  }

  static async create(userId = null, data = {}) {
    if (!userId) {
      throw new TypeError('userId can not be undefined or null')
    }
    
    try {
      let profileData = new ProfileObject({...data})
      profileData = profileData.validate('create')
      profileData = profileData.clean()
      const profile = await ProfileModel.create({...profileData})
      const userObject = new UserObject({_id: userId})
      userObject.setProfileId = profile._id
      const isUpdated = await userObject.save()
      if (isUpdated) {
        return new ProfileObject({...profile})
      }

      throw new Error("Failed to create profile.")
    } catch (error) {
      throw error
    }
  }

  async update(userId = null, updateData = {}) {
    if (!userId) {
      throw new TypeError('userId can not be undefined or null')
    }

    if (!(await isExistent(ProfileModel, {_id: this.id}))){
      throw new ObjectError({
        objectName: 'ProfileObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }
    
    try {
      let profileData = new ProfileObject({...updateData})
      profileData = profileData.validate('update')
      profileData = profileData.clean()
      const profile = await ProfileModel.findOneAndUpdate({_id: this.id}, {...profileData}, {new: true})
      const userObject = new UserObject({_id: userId})
      userObject.setProfileId = profile._id
      const isUpdated = await userObject.save()
      if (isUpdated) {
        return new ProfileObject({...profile})
      }

      throw new Error("Failed to update profile.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    const profileToSave = this.clean()
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'ProfileObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }

    try {
      const profileObject = await ProfileModel.findOneAndUpdate({ _id: this.id }, {...profileToSave}, {new: true})
      return profileObject
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'ProfileObject',
        errorProperty: 'Id',
        message: "Id is not valid"
      })
    }

    try {
      const profileObject = await ProfileModel.findOneAndDelete({_id: this.id})
      return profileObject
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProfileObject
