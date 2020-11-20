const ProviderModel = require("../models/ProviderModel")
const AddressModel = require('../models/AddressModel')
const validator = require("validator")
const { isExistent, hasSpecialChars, STATUS_VALUES } = require("../helper/validation")
const ValidationError = require('../errors/validation')
const AddressObject = require('./AddressObject')

class ProviderObject {
  constructor({ _id, name, addressId, email, status, createdAt }) {
    this.id = _id
    this.name = name
    this.address = (addressId) ? new AddressObject({...addressId}) : null 
    this.addressId = (this.address) ? this.address.id : null 
    this.email = email
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneProviderBy(criteria = {}, selectFields = null) {
    try {
      let provider = await ProviderModel.findOne(criteria, selectFields)
      .populate({path: 'addressId'})
      .lean()
      
      if (provider) {
        provider = new ProviderObject({ ...provider })
        return provider
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getProvidersBy(criteria = {}, selectFields = null) {
    try {
      const providers = await ProviderModel.find(criteria, selectFields)
      .populate({path: 'addressId'})
      .lean()

      if (providers.length > 0) {
        let providerList = new Array()

        providers.forEach((element) => {
          const object = new ProviderObject({ ...element })
          providerList.push(object)
        })

        return providerList
      }

      return null
    } catch (error) {
      throw error
    }
  }

  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    if (type === "create") {
      if (this.name == null) {
        errors.push({
          field: "name",
          message: "Must be required.",
        })
      }
      if (this.email == null) {
        errors.push({
          field: "email",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // name
    if (typeof this.name !== "undefined" && !validator.isEmpty(this.name.toString())) {
      if (hasSpecialChars(this.name)) {
        errors.push({
          field: "name",
          message: "Must contain only numbers, characters and spaces.",
          value: this.name
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 255 })) {
        errors.push({
          field: "name",
          message: "Must be from 4 to 255 characters.",
          value: this.name
        })
      }
    }
    // addressId
    if (typeof this.addressId !== "undefined" && !validator.isEmpty(this.addressId.toString())) {
        if (!validator.isMongoId(this.addressId)) {
          errors.push({
            field: 'addressId',
            message: "Invalid format.",
            value: this.addressId
          })
        }
        try {
          if (!(await isExistent(AddressModel, { _id: this.addressId }))) {
            errors.push({
              field: 'addressId',
              message: "Not existent.",
              value: this.addressId
            })
          }
        } catch (error) {
          errors.push({
            field: 'addressId',
            message: "Not existent.",
            value: this.addressId
          })
        }
    } 
    // email
    if (typeof this.email !== "undefined" && !validator.isEmpty(this.email.toString())) {
      const _email = this.email.toLowerCase()
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
      if (await isExistent(ProviderModel,{email: _email}, exceptionId)) {
        errors.push({
          field: "email",
          message: "Already existent.",
          value: _email,
        })
      }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status.toString())) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Not valid.",
          value: this.status
        })
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    } else {
      return this
    }
  }

  clean() {
    let providerObject = this
    const fieldsToClean = ["name", "email", "description", "status"]
    for (const [key, value] of Object.entries(providerObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "name" || key === "description") {
            providerObject[key] = validator.trim(value.toString())
          }
          if (key === "email" || key === "status") {
            providerObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }

        if (key === "updatedAt") {
          providerObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete providerObject[key]
      }
    }

    return providerObject
  }

  static async create({ ...providerData }) {
    try {
      let addressId = null
      if (!AddressObject.hasEmptyAddress(providerData.address)) {
        const createdAddress = await AddressObject.create({...providerData.address})
        addressId = createdAddress.id
      }
      providerData.addressId = addressId
      let providerObject = new ProviderObject({ ...providerData })
      const validation = await providerObject.validate("create")
      if (validation) {
        providerObject = providerObject.clean()
        const createdProvider = await ProviderModel.create({ ...validation })
        if (createdProvider) {
          const provider = new ProviderObject({ ...createdProvider })
          return provider
        }
      }

      throw new Error("Failed to create provider.")
    } catch (error) {
      throw error
    }
  }

  async update(updateData = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "ProviderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    if (!(await isExistent(ProviderModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "ProviderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      // Update address
      if (!ProviderObject.hasEmptyAddress(updateData.address)) {
        await this.address.update({...updateData.address})
      }
      // Update provider
      let updateObject = new ProviderObject({ ...updateData })
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        updateObject = updateObject.clean()
        const updated = new ProviderObject(
          await ProviderModel.findOneAndUpdate({ _id: this.id }, { ...validation }, { new: true })
        )

        return updated
      }

      throw new Error("Failed to update.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "ProviderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isSaved = await ProviderModel.findOneAndUpdate({ _id: this.id }).lean()
      if (isSaved) {
        return new ProviderObject({ ...isSaved })
      }

      throw new Error("Failed to save storage.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "ProviderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      // Remove address
      const addressObject = new AddressObject({...this.address})
      await addressObject.remove()

      const isRemoved = await ProviderModel.findOneAndDelete({ _id: this.id }).lean()
      if (isRemoved) {
        return new ProviderObject({ ...isRemoved })
      }

      throw new Error("Failed to remove provider.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProviderObject
