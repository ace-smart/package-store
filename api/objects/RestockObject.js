const RestockModel = require('../models/RestockModel')
const ProductModel = require('../models/ProductModel')
const validator = require('validator')
const ValidationError = require('../errors/validation')
const {isExistent, STATUS_VALUES} = require('../helper/validation')
const RESTOCK_ACTION_VALUES = ["import", "export"]

class RestockObject {
  constructor({_id, productId, amount, action, status, createdAt, updatedAt}) {
    this.id = _id
    this.productId = productId
    this.amount = amount
    this.action = action
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  
  static async getOneRestockBy(criteria = {}, selectFields = null) {
    try {
      let restock = await RestockModel.findOne(criteria, selectFields).lean()
      if (restock) {
        restock = new RestockObject({ ...restock })
        return restock
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getRestocksBy(criteria = {}, selectFields = null) {
    try {
      const restocks = await RestockModel.find(criteria, selectFields).lean()
      if (restocks.length > 0) {
        let restockList = new Array()

        restocks.forEach((element) => {
          const object = new RestockObject({ ...element })
          restockList.push(object)
        })

        return restockList
      }

      return null
    } catch (error) {
      throw error
    }
  }

  async validate(type = "create") {
    let errors = new Array()

    if (type === "create") {
      if (this.productId == null || validator.isEmpty(this.productId.toString())) {
        errors.push({
          field: "productId",
          message: "Must be required.",
        })
      }
      if (this.amount == null || validator.isEmpty(this.amount.toString())) {
        errors.push({
          field: "amount",
          message: "Must be required.",
        })
      }
      if (this.action == null || validator.isEmpty(this.action.toString())) {
        errors.push({
          field: "action",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // productId
    if (typeof this.productId !== "undefined" && !validator.isEmpty(this.productId.toString())) {
      if (!validator.isMongoId(this.productId)) {
        errors.push({
          field: "productId",
          message: "Invalid format.",
        })
      }
      if (! await (isExistent(ProductModel,{ _id: this.productId }))) {
        errors.push({
          field: "productId",
          message: "Not existent.",
        })
      }
    }
    // amount
    if (typeof this.amount !== "undefined" && !validator.isEmpty(this.amount.toString())) {
      if (!validator.isNumeric(this.amount.toString())) {
        errors.push({
          field: "amount",
          message: "Must contain only numbers.",
        })
    }
    if (parseInt(this.amount.toString()) <= 0) {
      errors.push({
        field: "amount",
        message: "Must greater than 0.",
      })
    }
    }
    // action
    if (typeof this.action !== "undefined" && !validator.isEmpty(this.action.toString())) {
      if (!validator.isIn(this.action.toLowerCase(), RESTOCK_ACTION_VALUES)) {
        errors.push({
          field: "action",
          message: "Not valid.",
        })
      }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status.toString())) {
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
    let restockObject = this
    const fieldsToClean = ["amount", "action","status"]
    for (const [key, value] of Object.entries(restockObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "amount") {
            restockObject[key] = parseInt(validator.trim(value.toString()))
          }
          if (key === "action" || key === "status") {
            restockObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }

        if (key === "updatedAt") {
          restockObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete restockObject[key]
      }
    }

    return restockObject
  }

  static async create({ ...restockData }) {
    try {
      let restockObject = new RestockObject({ ...restockData })
      restockObject = restockObject.clean()
      const validation = await restockObject.validate("create")
      if (validation) {
        const createdRestock = await RestockModel.create({ ...validation })
        if (createdRestock) {
          const restock = new RestockObject({ ...createdRestock })
          return restock
        }
      }

      throw new Error("Failed to create restock.")
    } catch (error) {
      throw error
    }
  }

  async update(updateData = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "RestockObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    if (!(await isExistent(RestockModel))) {
      throw new ObjectError({
        objectName: "RestockObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let updateObject = new RestockObject({ ...updateData })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        const updated = new RestockObject(
          await RestockModel.findOneAndUpdate(
            { _id: this.id },
            { ...validation },
            { new: true }
          )
        )

        return updated
      }

      throw new Error("Failed to update restock.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "RestockObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isSaved = await RestockModel.findOneAndUpdate({ _id: this.id }).lean()
      if (isSaved) {
        return new RestockObject({ ...isSaved })
      }

      throw new Error("Failed to save restock.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "RestockObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isRemoved = await RestockModel.findOneAndDelete({ _id: this.id }).lean()
      if (isRemoved) {
        return new RestockObject({ ...isRemoved })
      }

      throw new Error("Failed to remove restock.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = RestockObject