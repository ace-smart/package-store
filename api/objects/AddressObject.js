const UserModel = require("../models/UserModel")
const AddressModel = require("../models/AddressModel")
const { isExistent, hasSpecialChars } = require("../helper/validation")
const validator = require("validator")
const ValidationError = require("../errors/validation")
const ObjectError = require("../errors/object")
const UserObject = require("./UserObject")
const NotFoundError = require("../errors/not_found")
const {toCapitalize} = require('../helper/format')
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

      return null
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

      return null
    } catch (error) {
      throw error
    }
  }

  validate(type = "create") {
    let errors = new Array()

    if (type === "create") {
      if (this.street == null) {
        errors.push({
          field: "street",
          message: "Must be required.",
        })
      }
      if (this.district == null) {
        errors.push({
          field: "district",
          message: "Must be required.",
        })
      }
      if (this.city == null) {
        errors.push({
          field: "city",
          message: "Must be required.",
        })
      }
      if (this.country == null) {
        errors.push({
          field: "country",
          message: "Must be required.",
        })
      }
      if (this.postalCode == null) {
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
    if (this.street != null && !validator.isEmpty(this.street.toString())) {
      if (validator.matches(
          this.street.toString(),
          new RegExp("[\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?]+", "g")
        )) {
        errors.push({
          field: "street",
          message: "Only allowed to have these special characters [\\/-,.:]",
          value: this.street
        })
      }
      if (!validator.matches(this.street.toString(), RegExp("[\\w/-/\\.\\,:]+", "g"))) {
        errors.push({
          field: "street",
          message: "Must contain only numbers, characters and [\\/-,.:].",
          value: this.street
        })
      }
      if (!validator.isLength(this.street.toString(), { max: 350 })) {
        errors.push({
          field: "street",
          message: "Must be under 350 characters.",
          value: this.street
        })
      }
    }
    if (this.district != null && !validator.isEmpty(this.district.toString())) {
      if (hasSpecialChars(this.district)) {
        errors.push({
          field: "district",
          message: "Can not have special characters.",
          value: this.district
        })
      }
      if (!validator.isLength(this.district.toString(), { max: 255 })) {
        errors.push({
          field: "district",
          message: "Must be under 255 characters.",
          value: this.district
        })
      }
    }
    if (this.city != null && !validator.isEmpty(this.city.toString())) {
      if (hasSpecialChars(this.city)) {
        errors.push({
          field: "city",
          message: "Can not have special characters.",
          value: this.city
        })
      }
      if (!validator.isLength(this.city.toString(), { max: 300 })) {
        errors.push({
          field: "city",
          message: "Must be under 255 characters.",
          value: this.country
        })
      }
    }
    if (this.country != null && !validator.isEmpty(this.country.toString())) {
      if (hasSpecialChars(this.country)) {
        errors.push({
          field: "country",
          message: "Can not have special characters.",
          value: this.country
        })
      }
      if (!validator.isLength(this.country.toString(), { max: 255 })) {
        errors.push({
          field: "country",
          message: "Must be under 255 characters.",
          value: this.country
        })
      }
    }
    if (this.postalCode != null && !validator.isEmpty(this.postalCode.toString())) {
      if (!validator.isNumeric(this.postalCode.toString(), { no_symbols: true })) {
        errors.push({
          field: "postalCode",
          message: "Must be only numbers.",
          value: this.postalCode
        })
      }
      if (!validator.isLength(this.postalCode.toString(), { max: 10 })) {
        errors.push({
          field: "postalCode",
          message: "Must be under 10 characters.",
          value: this.postalCode
        })
      }
    }
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Status is not valid.",
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
    const fieldsToClean = ["street", "district", "city", "country", "postalCode", "status"]
    for (const [key, value] of Object.entries(addressObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === 'postalCode') {
            addressObject[key] = parseInt(value.toString())
          }
          if (key === 'district' || key === 'city' || key ==='country'){
            addressObject[key] = toCapitalize(validator.trim(value.toString().toLowerCase()))
          } 
          if (key === 'street' || key === 'status'){
            addressObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }
        
        if (key === 'updatedAt') {
          addressObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete addressObject[key]
      }
    }

    return addressObject
  }

  //@desc:    Empty => return true
  static hasEmptyAddress(addressData) {
    let emptyProps = []
    for (const [key, value] of Object.entries(addressData)) {
      if (value == null) {
        emptyProps.push(key)
      } else if (!validator.isEmpty(value.toString())) {
        emptyProps.push(key)
      }
    }

    if (emptyProps.length > 0) {
      return false
    }

    return true
  } 
  
  static async create({ ...addressData } = {}) {
    try { 
      let address = new AddressObject({ ...addressData })
      const validation = address.validate("create")
      if (validation) {
        address = address.clean()
        const createdAddress = new AddressObject(await AddressModel.create({ ...address }))
        return createdAddress.id
      }

      throw new Error("Failed to create address")
    } catch (error) {
      throw error
    }
  }

  async update(info = {}) {
    if (this.id == null) {
      throw new TypeError("Can not update with null or undefined Id.")
    }

    if (!(await isExistent(AddressModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "AddressObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let addressObject = new AddressObject({ ...info })
      const isValid = addressObject.validate("update")
      if (isValid) {
        addressObject = addressObject.clean()
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

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "AddressObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isRemoved = await AddressModel.findOneAndDelete( { _id: this.id } ).lean()
      
      if (isRemoved) {
        return new AddressObject({...isRemoved})
      }

      throw new Error("Failed to remove address.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = AddressObject
