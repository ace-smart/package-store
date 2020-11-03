const ProviderModel = require("../models/ProviderModel")
const AddressModel = require('../models/AddressModel')
const validator = require("validator")
const { isExistent, hasSpecialChars, STATUS_VALUES } = require("../helper/validation")
const ValidationError = require('../errors/validation')

class ProviderObject {
  constructor({ _id, name, addressId, email, description, status, createdAt }) {
    this.id = _id
    this.name = name
    this.addressId = addressId
    this.email = email
    this.description = description
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneProviderBy(criteria = {}, selectFields = null) {
    try {
      let provider = await ProviderModel.findOne(criteria, selectFields).lean()
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
      const providers = await ProviderModel.find(criteria, selectFields).lean()
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
      if (this.name == null || validator.isEmpty(this.name)) {
        errors.push({
          field: "name",
          message: "Must be required.",
        })
      }
      if (this.addressId == null || validator.isEmpty(this.addressId)) {
        errors.push({
          field: "addressId",
          message: "Must be required.",
        })
      }
      if (this.email == null || validator.isEmpty(this.email)) {
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
    if (typeof this.name !== "undefined" && !validator.isEmpty(this.name)) {
      if (hasSpecialChars(this.name)) {
        errors.push({
          field: "name",
          message: "Must contain only numbers,characters and spaces.",
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 255 })) {
        errors.push({
          field: "name",
          message: "Must be from 4 to 255 characters.",
        })
      }
    }
    // addressId
    if (typeof this.addressId !== "undefined" && !validator.isEmpty(this.addressId)) {
        if (!validator.isMongoId(this.addressId)) {
          errors.push({
            field: 'addressId',
            message: "Invalid format."
          })
        }
        try {
          if (!(await isExistent(AddressModel, { _id: this.addressId }))) {
            errors.push({
              field: 'addressId',
              message: "Not existent."
            })
          }
        } catch (error) {
          errors.push({
            field: 'addressId',
            message: "Not existent."
          })
        }
    } 
    // email
    if (typeof this.email !== "undefined" && !validator.isEmpty(this.email)) {
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
    // description
    if (typeof this.description !== "undefined" && !validator.isEmpty(this.description)) {
        if (hasSpecialChars(validator.trim(this.description))) {
          errors.push({
            field: 'description',
            message: "Must not be filled in with special characters."
          })
        }
        if (!validator.isLength(validator.trim(this.description), { max: 300 })) {
          errors.push({
            field: 'description',
            message: "Must be under 300 characters."
          })
        }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status)) {
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
      let providerObject = new ProviderObject({ ...providerData })
      providerObject = providerObject.clean()
      const validation = await providerObject.validate("create")
      if (validation) {
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
      let updateObject = new ProviderObject({ ...updateData })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update")
      if (validation) {
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
