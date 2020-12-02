const validator = require("validator")
const ProfileModel = require("../models/ProfileModel")
const ValidationError = require("../errors/validation")
const { toFormatDateStr, toCapitalize } = require("../helper/format")
const ObjectError = require("../errors/object")
const PROFILE_GENDER_VALUES = ["male", "female", "lgbt"]
const STATUS_VALUES = ["deactivated", "activated"]
const AVATAR_MIMETYPE = ["image/jpeg", "image/png"]
const { isExistent, hasSpecialChars } = require("../helper/validation")

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

  static hasEmptyProfileData(profileData) {
    const profileKeys = Object.keys(profileData)
    let emptyProps = []
    for (const [key, value] of Object.entries(profileData)) {
      if (value == null) {
        emptyProps.push(key)
      } else if (validator.isEmpty(value.toString())) {
        emptyProps.push(key)
      }
    }

    if (emptyProps.length === profileKeys.length) {
      return true
    }

    return false
  }

  // @desc:       Get profile
  // Existed:     => return ProfileObject
  // Not Existed  => return null
  static async getOneProfileById(profileId = null) {
    try {
      if (profileId != null) {
        const profile = await ProfileModel.findOne({
          _id: profileId,
        }).lean()
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
      // if (this.firstName == null || validator.isEmpty(this.firstName.toString())) {
      //   errors.push({
      //     field: "firstName",
      //     message: "firstName must be required",
      //   })
      // }
      // if (this.lastName == null  || validator.isEmpty(this.lastName.toString())) {
      //   errors.push({
      //     field: "lastName",
      //     message: "lastName must be required",
      //   })
      // }
      // if (this.gender == null || validator.isEmpty(this.gender.toString())) {
      //   errors.push({
      //     field: "gender",
      //     message: "gender must be required",
      //   })
      // }
      // if (this.dateOfBirth == null || validator.isEmpty(this.dateOfBirth.toString())) {
      //   errors.push({
      //     field: "dateOfBirth",
      //     message: "dateOfBirth must be required",
      //   })
      // }
      // if (this.phoneNumber == null || validator.isEmpty(this.phoneNumber.toString())) {
      //   errors.push({
      //     field: "phoneNumber",
      //     message: "phoneNumber must be required",
      //   })
      // }

      // has errors
      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // Validate after being filled
    // === firsName ===
    if (this.firstName != null && !validator.isEmpty(this.firstName.toString())) {
      if (hasSpecialChars(this.firstName)) {
        errors.push({
          field: "firstName",
          message: "Can not have special characters.",
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
    if (this.lastName != null && !validator.isEmpty(this.lastName.toString())) {
      if (hasSpecialChars(this.lastName)) {
        errors.push({
          field: "lastName",
          message: "Can not have special characters.",
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
    if (this.gender != null && !validator.isEmpty(this.gender.toString())) {
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
    if (this.dateOfBirth != null && !validator.isEmpty(this.dateOfBirth.toString())) {
      if (!validator.isDate(this.dateOfBirth)) {
        errors.push({
          field: "dateOfBirth",
          message: "Invalid format",
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
          message: "Must be older 16 years old",
          value: this.dateOfBirth,
        })
      }
    }
    // === phoneNumber ===
    if (this.phoneNumber != null && !validator.isEmpty(this.phoneNumber.toString())) {
      if (!validator.isNumeric(this.phoneNumber)) {
        errors.push({
          field: "phoneNumber",
          message: "Must be numeric characters.",
          value: this.phoneNumber,
        })
      }
    }
    // mimeType
    if (this.avatar != null && !validator.isEmpty(this.avatar.toString())) {
      if (this.avatar.mimeType != null) {
        if (!validator.isIn(this.avatar.mimeType.toString(), AVATAR_MIMETYPE)) {
          errors.push({
            field: "mimeType",
            message: "Invalid value.",
            value: this.avatar,
            mimeType,
          })
        }
      }
    }

    // === status ===
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
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
          if (key === "firstName" || key === "lastName") {
            profileObject[key] = toCapitalize(validator.trim(value.toString().toLowerCase()))
          }
          if (key === "gender" || key === "status") {
            profileObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }
        if (key === "updatedAt") {
          profileObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete profileObject[key]
      }
    }

    return profileObject
  }

  static async create({ ...profileData }) {
    try {
      let profileObject = new ProfileObject({ ...profileData })
      const validation = profileObject.validate("create")
      if (validation) {
        profileObject = profileObject.clean()
        const profile = await ProfileModel.create({ ...profileObject })
        if (profile) {
          return new ProfileObject({ ...profile._doc })
        }
      }

      throw new Error("Failed to create profile.")
    } catch (error) {
      throw error
    }
  }

  async update(updateData = {}) {
    if (!(await isExistent(ProfileModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "ProfileObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      let profileData = new ProfileObject({ ...updateData })
      const validation = profileData.validate("update")
      if (validation) {
        profileData = profileData.clean()
        const profile = await ProfileModel.findOneAndUpdate(
          { _id: this.id },
          { ...profileData },
          { new: true }
        )

        if (profile) {
          return new ProfileObject({ ...profile })
        }
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
        objectName: "ProfileObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      const profileObject = await ProfileModel.findOneAndUpdate(
        { _id: this.id },
        { ...profileToSave },
        { new: true }
      )
      return profileObject
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "ProfileObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      const profileObject = await ProfileModel.findOneAndDelete({ _id: this.id })
      return profileObject
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProfileObject
