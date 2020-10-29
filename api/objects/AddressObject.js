const UserModel = require("../models/UserModel")
const AddressModel = require("../models/AddressModel")
const { isExistent } = require("../helper/validation")
const validator = require("validator")
const ValidationError = require("../errors/validation")
const ObjectError = require("../errors/object")
const UserObject = require("./UserObject")
const NotFoundError = require("../errors/not_found")
const STATUS_VALUES = ["activated", "deactivated"]

class AddressObject {
  constructor({ _id, street, district, city, country, postalCode, status }) {
    this.id = _id
    this.street = street
    this.district = district
    this.city = city
    this.country = country
    this.postalCode = postalCode
    this.status = status
  }

  static async getAddressListByUserId(userId = null) {
    if (userId == null) {
      throw new TypeError("userId can not be null or undefined.")
    }
    if (!(await isExistent(UserModel, { _id: userId }))) {
      throw new NotFoundError("No user found.")
    }

    try {
      const userObject = await UserObject.getOneUserBy({_id: userId})
      if (userObject.getAddress instanceof Array && userObject.getAddress.length > 0) {
        let addressList = []
        for (let i = 0; i < userObject.getAddress.length ; i++) {
          const addressObject = await AddressModel.findOne({_id: userObject.getAddress[i]}).lean()
          addressList.push(new AddressObject(addressObject))
        }

        return addressList
      }

      throw new NotFoundError("No address found")
    } catch (error) {
      throw error
    }
  }

  static async getOneAddressById(userId = null, addressId = null, selectFields = null) {
    if (userId == null) {
      throw new TypeError("userId can not be null or undefined.")
    }
    if (addressId == null) {
      throw new TypeError("addressId can not be null or undefined.")
    }
    if (!(await isExistent(UserModel, { _id: userId }))) {
      throw new NotFoundError("No user found.")
    }

    try {
      const userObject = await UserModel.findOne({ _id: userId }, "addressId").lean()
      const addressList = userObject.addressId
      if (addressList.length > 0) {
        const isExistent = addressList.find((element) => element == addressId)
        if (isExistent) {
          const address = await AddressModel.findOne({ _id: addressId }, selectFields).lean()
          if (address) {
            return new AddressObject(address)
          }
        }
      }

      throw new NotFoundError("No address found.")
    } catch (error) {
      throw error
    }
  }

  validate(type = "create") {
    let errors = new Array()

    if (type === "create") {
      if (typeof this.street === "undefined" || validator.isEmpty(this.street)) {
        errors.push({
          field: "street",
          message: "Must be required.",
        })
      }
      if (typeof this.district === "undefined" || validator.isEmpty(this.district)) {
        errors.push({
          field: "district",
          message: "Must be required.",
        })
      }
      if (typeof this.city === "undefined" || validator.isEmpty(this.city)) {
        errors.push({
          field: "city",
          message: "Must be required.",
        })
      }
      if (typeof this.country === "undefined" || validator.isEmpty(this.country)) {
        errors.push({
          field: "country",
          message: "Must be required.",
        })
      }
      if (typeof this.postalCode === "undefined" || validator.isEmpty(this.postalCode)) {
        errors.push({
          field: "postalCode",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }
    // update
    if (this.street != null && !validator.isEmpty(this.street)) {
      if (
        validator.matches(
          this.street,
          new RegExp("[\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?]+", "g")
        )
      ) {
        errors.push({
          field: "street",
          message: "Only allowed to have these special characters [\\/-,.:]",
        })
      }
      if (!validator.matches(this.street, RegExp("[\\w/-/\\.\\,:]+", "g"))) {
        errors.push({
          field: "street",
          message: "Must contain only numbers, characters and [\\/-,.:].",
        })
      }
      if (!validator.isLength(this.street, { max: 350 })) {
        errors.push({
          field: "street",
          message: "Must be under 350 characters.",
        })
      }
    }
    if (this.district != null && !validator.isEmpty(this.district)) {
      if (!validator.isAlphanumeric(this.district)) {
        errors.push({
          field: "district",
          message: "Must contain only numbers and characters.",
        })
      }
      if (!validator.isLength(this.district, { max: 255 })) {
        errors.push({
          field: "district",
          message: "Must be under 255 characters.",
        })
      }
    }
    if (this.city != null && !validator.isEmpty(this.city)) {
      if (!validator.isAlphanumeric(this.city)) {
        errors.push({
          field: "city",
          message: "Must contain only numbers and characters.",
        })
      }
      if (!validator.isLength(this.city, { max: 300 })) {
        errors.push({
          field: "city",
          message: "Must be under 255 characters.",
        })
      }
    }
    if (this.country != null && !validator.isEmpty(this.country)) {
      if (!validator.isAlpha(this.country)) {
        errors.push({
          field: "country",
          message: "Must contain only alphabetic characters.",
        })
      }
      if (!validator.isLength(this.country, { max: 255 })) {
        errors.push({
          field: "country",
          message: "Must be under 255 characters.",
        })
      }
    }
    if (this.postalCode != null && !validator.isEmpty(this.postalCode)) {
      if (!validator.isNumeric(this.postalCode, { no_symbols: true })) {
        errors.push({
          field: "postalCode",
          message: "Must be only numbers.",
        })
      }
      if (!validator.isLength(this.postalCode, { max: 10 })) {
        errors.push({
          field: "postalCode",
          message: "Must be under 10 characters.",
        })
      }
    }
    if (this.status != null && !validator.isEmpty(this.status)) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Not valid.",
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
    let addressObject = this
    const lowerCaseFields = ["status"]
    for (const [key, value] of Object.entries(addressObject)) {
      if (value != null) {
        const isFound = lowerCaseFields.find((field) => key === field)
        if (isFound) {
          addressObject[key] = value.toString().toLowerCase()
        }
      }

      if (typeof value === "undefined") {
        delete addressObject[key]
      }
    }

    return addressObject
  }

  static async create(userId = null, { ...addressData } = {}) {
    if (userId == null) {
      throw new TypeError("userId can not be null or undefined.")
    }

    try {
      let address = new AddressObject({ ...addressData })
      const isValid = address.validate("create")
      if (isValid) {
        address = address.clean()
        const createdAddress = new AddressObject(await AddressModel.create({ ...address }))
        const user = await UserObject.getOneUserBy({ _id: userId })
        if (user) {
          user.setAddress = createdAddress.id
          const isSaved = await user.save()
          if (isSaved) {
            return createdAddress
          }
        }
      }

      throw new Error("Failed to create address")
    } catch (error) {
      throw error
    }
  }

  async update(userId = null, info = {}) {
    if (this.id == null) {
      throw new TypeError("Can not update with null or undefined Id.")
    }
    if (userId == null) {
      throw new TypeError("userId can not be null or undefined.")
    }

    if (!(await isExistent(AddressModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "AddressObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }
    if (!(await isExistent(UserModel, { _id: userId }))) {
      throw new ObjectError({
        objectName: "UserObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let addressObject = new AddressObject({ ...info })
      addressObject = addressObject.clean()
      const isValid = addressObject.validate("update")
      if (isValid) {
        const updatedAddress = new AddressObject(
          await AddressModel.findOneAndUpdate({ _id: this.id }, { ...addressObject }, { new: true })
        )
        if (updatedAddress) {
          return updatedAddress
        }
      }
      
      throw new Error("Failed to update address")
    } catch (error) {
      throw error
    }
  }

  async save() {
    const addressToSave = this.clean()
    try {
      if (this.id != null) {
        const isSaved = await AddressModel.findOneAndUpdate(
          { _id: this.id },
          { ...addressToSave },
          { new: true }
        )

        return new AddressObject(isSaved)
      }

      throw new ObjectError({
        objectName: "AddressObject",
        errorProperty: "Id",
        message: "Can not save object with undefined or null id.",
      })
    } catch (error) {
      throw error
    }
  }

  async remove(userId = null) {
    if (userId == null) {
      throw new TypeError("userId can not be null or undefined.")
    }

    try {
      if (this.id != null) {
        const isRemoved = await AddressModel.findOneAndDelete(
          { _id: this.id }
        )
        
        if (isRemoved) {
          const user = await UserObject.getOneUserBy({_id: userId})
          if (user) {
            user.addressId = user.getAddress.filter((value) => value != this.id)
            await user.save()
          } else {
            throw new NotFoundError("No user found.")
          }
        }

        return true
      }

      throw new ObjectError({
        objectName: "AddressObject",
        errorProperty: "Id",
        message: "Can not delete object with undefined or null id.",
      })
    } catch (error) {
      throw error
    }
  }
}

module.exports = AddressObject
