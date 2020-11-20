const OrderDetailModel = require("../models/OrderDetailModel")
const ProductModel = require("../models/ProductModel")
const validator = require("validator")
const { isExistent, STATUS_VALUES } = require("../helper/validation")
const ValidationError = require("../errors/validation")
const ObjectError = require("../errors/object")

class OrderDetailObject {
  constructor({ _id, orderId, productId, amount, totalCost, status, createdAt }) {
    this.id = _id
    this.orderId = orderId
    this.productId = productId
    this.amount = amount
    this.totalCost = totalCost
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneOrderDetailBy(criteria = {}, selectFields = null) {
    try {
      let orderDetail = await OrderDetailModel.findOne(criteria, selectFields).lean()
      if (orderDetail) {
        orderDetail = new OrderDetailObject({ ...orderDetail })
        return orderDetail
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getOrderDetailsBy(criteria = {}, selectFields = null) {
    try {
      const orderDetails = await OrderDetailModel.find(criteria, selectFields).lean()
      if (orderDetails.length > 0) {
        let orderDetailList = new Array()

        orderDetails.forEach((element) => {
          const object = new OrderDetailObject({ ...element })
          orderDetailList.push(object)
        })

        return orderDetailList
      }

      return null
    } catch (error) {
      throw error
    }
  }

  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    if (type === "create") {
      if (this.productId == null || validator.isEmpty(this.productId.toString())) {
        errors.push({
          field: "productId",
          message: "Must be required.",
        })
      }
      if (this.orderId == null || validator.isEmpty(this.orderId.toString())) {
        errors.push({
          field: "orderId",
          message: "Must be required.",
        })
      }
      if (this.totalCost == null || validator.isEmpty(this.totalCost.toString())) {
        errors.push({
          field: "totalCost",
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
    // totalCost
    if (typeof this.totalCost !== "undefined" && !validator.isEmpty(this.totalCost.toString())) {
      if (!validator.isNumeric(this.totalCost.toString())) {
        errors.push({
          field: "totalCost",
          message: "Must contain only numbers.",
        })
    }
    if (!validator.isLength(this.totalCost.toString(),{min: 1})) {
      errors.push({
        field: "totalCost",
        message: "Must greater than 0.",
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
    let orderDetailObject = this
    const fieldsToClean = ["amount", "totalCost","status"]
    for (const [key, value] of Object.entries(orderDetailObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "amount") {
            orderDetailObject[key] = parseInt(validator.trim(value.toString()))
          }
          if (key === "totalCost") {
            orderDetailObject[key] = parseFloat(validator.trim(value.toString()))
          }
          if (key === "status") {
            orderDetailObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }

        if (key === "updatedAt") {
          orderDetailObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete orderDetailObject[key]
      }
    }

    return orderDetailObject
  }

  static async create({ ...orderDetailData }) {
    try {
      let orderDetailObject = new OrderDetailObject({ ...orderDetailData })
      orderDetailObject = orderDetailObject.clean()
      const validation = await orderDetailObject.validate("create")
      if (validation) {
        const createdOrderDetail = await OrderDetailModel.create({ ...validation })
        if (createdOrderDetail) {
          const orderDetail = new OrderDetailObject({ ...createdOrderDetail })
          return orderDetail
        }
      }

      throw new Error("Failed to create orderDetail.")
    } catch (error) {
      throw error
    }
  }

  async update(updateData = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "OrderDetailObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    if (!(await isExistent(OrderDetailModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "OrderDetailObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let updateObject = new OrderDetailObject({ ...updateData })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        const updated = new OrderDetailObject(
          await OrderDetailModel.findOneAndUpdate(
            { _id: this.id },
            { ...validation },
            { new: true }
          )
        )

        return updated
      }

      throw new Error("Failed to update orderDetail.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "OrderDetailObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isSaved = await OrderDetailModel.findOneAndUpdate({ _id: this.id }).lean()
      if (isSaved) {
        return new OrderDetailObject({ ...isSaved })
      }

      throw new Error("Failed to save orderDetail.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "OrderDetailObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isRemoved = await OrderDetailModel.findOneAndDelete({ _id: this.id }).lean()
      if (isRemoved) {
        return new OrderDetailObject({ ...isRemoved })
      }

      throw new Error("Failed to remove orderDetail.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = OrderDetailObject
