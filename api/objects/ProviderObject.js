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
    this.addressId = addressId
    this.email = email
    this.status = status
    this.createdAt = createdAt
  }

  async setAddress() {
    if(this.addressId instanceof Object) {
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

  static async getOneProviderBy(criteria = {}, selectFields = null) {
    try {
      const providerDoc = await ProviderModel.findOne(criteria, selectFields)
      .populate({path: 'addressId'})
      .lean()
      
      if (providerDoc) {
        const provider = new ProviderObject({ ...providerDoc })
        await provider.setAddress()
        return provider
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getProvidersBy(criteria = {}, selectFields = null) {
    try {
      const providerDocs = await ProviderModel.find(criteria, selectFields).lean()

      if (providerDocs.length > 0) {
        let providerList = new Array()

        providerDocs.forEach(async (element) => {
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
      if (this.name == null || validator.isEmpty(this.name.toString())) {
        errors.push({
          field: "name",
          message: "Must be required.",
        })
      }
      if (this.email == null || validator.isEmpty(this.email.toString())) {
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
    if (this.name != null && !validator.isEmpty(this.name.toString())) {
      if (hasSpecialChars(this.name.toString())) {
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
    if (this.addressId != null && !validator.isEmpty(this.addressId.toString())) {
        if (!validator.isMongoId(this.addressId)) {
          errors.push({
            field: 'addressId',
            message: "Invalid format.",
            value: this.addressId
          })
        }
        if (!(await isExistent(AddressModel, { _id: this.addressId }))) {
          errors.push({
            field: 'addressId',
            message: "Not existent.",
            value: this.addressId
          })
        }
    } 
    // email
    if (this.email != null && !validator.isEmpty(this.email.toString())) {
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
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
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
      // [Create] address
      if (providerData.address) {
        if (!AddressObject.hasEmptyAddressData(providerData.address)) {
          const createdAddress = await AddressObject.create({...providerData.address})
          providerData.addressId = createdAddress.id.toString()
        } else {
          delete providerData.address
        }
      }
      // Add provider
      let providerObject = new ProviderObject({ ...providerData })
      const validation = await providerObject.validate("create")
      if (validation) {
        providerObject = providerObject.clean()
        const createdProvider = await ProviderModel.create({ ...providerObject })
        if (createdProvider) {
          return new ProviderObject({ ...createdProvider._doc })
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
      // [Create/Update] address
      if (updateData.address) {
        if (!AddressObject.hasEmptyAddressData(updateData.address)) {
          if(updateData.address.id == null) {
            // Create 
            const createdAddress = await AddressObject.create({...updateData.address})
            updateData.addressId = createdAddress.id.toString()
          } else{
            // Update
            const addressObj = await AddressObject.getOneAddressById(updateData.address.id)
            await addressObj.update({...updateData.address})
          }
        }
      }
      
      // Update provider
      let updateObject = new ProviderObject({ ...updateData })
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        updateObject = updateObject.clean()
        const updated = await ProviderModel.findOneAndUpdate(
          { _id: this.id }, { ...updateObject }, { new: true })

        return new ProviderObject(updated)
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
