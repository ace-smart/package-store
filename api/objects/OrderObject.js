const OrderModel = require("../models/OrderModel")
const UserModel = require('../models/UserModel')
const VoucherModel = require("../models/VoucherModel")
const { isExistent } = require("../helper/validation")
const validator = require("validator")
const ValidationError = require("../errors/validation")
const ORDER_STATUS_VALUES = [
  "processing",
  "received",
  "racking",
  "delivering",
  "done",
  "refunded",
  "canceled",
]

class OrderObject {
  constructor({
    _id,
    totalCost,
    shippingFee,
    finalCost,
    currency,
    paymentMethod,
    userId,
    voucherCode,
    deliveryDay,
    status,
    createdAt,
  }) {
    this.id = _id
    this.totalCost = totalCost
    this.shippingFee = shippingFee
    this.finalCost = finalCost
    this.currency = currency
    this.paymentMethod = paymentMethod
    this.userId = userId
    this.voucherCode = voucherCode
    this.deliveryDay = deliveryDay
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneOrderBy(criteria = {}, selectFields = null) {
    try {
      let order = await OrderModel.findOne(criteria, selectFields).lean()
      if (order) {
        order = new OrderObject({ ...order })
        return order
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getOrdersBy(criteria = {}, selectFields = null) {
    try {
      const orders = await OrderModel.find(criteria, selectFields).lean()
      if (orders.length > 0) {
        let orderList = new Array()

        orders.forEach((element) => {
          const object = new OrderObject({ ...element })
          orderList.push(object)
        })

        return orderList
      }

      return null
    } catch (error) {
      throw error
    }
  }

  async validate(type = "create") {
    let errors = new Array()

    if (type === "create") {
      if (this.totalCost == null || validator.isEmpty(this.totalCost.toString())) {
        errors.push({
          field: "totalCost",
          message: "Must be required.",
        })
      }
      if (this.shippingFee == null || validator.isEmpty(this.shippingFee.toString())) {
        errors.push({
          field: "shippingFee",
          message: "Must be required.",
        })
      }
      if (this.finalCost == null || validator.isEmpty(this.finalCost.toString())) {
        errors.push({
          field: "finalCost",
          message: "Must be required.",
        })
      }
      if (this.paymentMethod == null || validator.isEmpty(this.paymentMethod.toString())) {
        errors.push({
          field: "paymentMethod",
          message: "Must be required.",
        })
      }
      if (this.userId == null || validator.isEmpty(this.userId.toString())) {
        errors.push({
          field: "userId",
          message: "Must be required.",
        })
      }
      if (this.deliveryDay == null || validator.isEmpty(this.deliveryDay.toString())) {
        errors.push({
          field: "deliverDay",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
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
    }
    // shippingFee
    if (
      typeof this.shippingFee !== "undefined" &&
      !validator.isEmpty(this.shippingFee.toString())
    ) {
      if (!validator.isNumeric(this.shippingFee.toString())) {
        errors.push({
          field: "shippingFee",
          message: "Must contain only numbers.",
        })
      }
    }
    // finalCost
    if (typeof this.finalCost !== "undefined" && !validator.isEmpty(this.finalCost.toString())) {
      if (!validator.isNumeric(this.finalCost.toString())) {
        errors.push({
          field: "finalCost",
          message: "Must contain only numbers.",
        })
      }
    }
    // currency
    if (typeof this.currency !== "undefined" && !validator.isEmpty(this.currency.toString())) {
      if (!validator.isAlpha(this.currency)) {
        errors.push({
          field: "currency",
          message: "Must contain only alphabetic characters. (eg. USD, CADm EUR)",
        })
      }
      if (!validator.isLength(this.currency, { max: 6 })) {
        errors.push({
          field: "currency",
          message: "Must be under 6 characters.",
        })
      }
    }
    // paymentMethod
    if (typeof this.paymentMethod !== "undefined" && !validator.isEmpty(this.paymentMethod.toString())) {
      if (!validator.isAlpha(this.paymentMethod)) {
        errors.push({
          field: "paymentMethod",
          message: "Must contain only alphabetic characters.",
        })
      }
      if (!validator.isLength(this.paymentMethod, { max: 30 })) {
        errors.push({
          field: "paymentMethod",
          message: "Must be under 30 characters.",
        })
      }
    }

    // userId
    if (typeof this.userId !== "undefined" && !validator.isEmpty(this.userId.toString())) {
      if (!validator.isMongoId(this.userId)) {
        errors.push({
          field: "userId",
          message: "Invalid format.",
        })
      }
      if (!isExistent(UserModel, { _id: this.userId })) {
        errors.push({
          field: "userId",
          message: "Invalid value.",
        })
      }
    }
    // voucherCode
    if (
      typeof this.voucherCode !== "undefined" &&
      !validator.isEmpty(this.voucherCode.toString())
    ) {
      if (!validator.isAlphanumeric(this.voucherCode.toString())) {
        errors.push({
          field: "voucherCode",
          message: "Must be only alphabetic characters.",
        })
      }
      if (
        !(await isExistent(VoucherModel, {
          code: this.voucherCode.toString(),
        }))
      ) {
        errors.push({
          field: "voucherCode",
          message: "Invalid value.",
        })
      }
    }
    // deliverDay
    if (typeof this.deliveryDay !== "undefined" && !validator.isEmpty(this.deliveryDay.toString())) {
      if (!validator.isDate(this.deliveryDay)) {
        errors.push({
          field: "deliveryDay",
          message: "Invalid format [YYYY/MM/DD]",
        })
      }
      if (!validator.isAfter(this.deliveryDay.toString(), new Date().toString())) {
        errors.push({
          field: "deliveryDay",
          message: "Invalid value.",
        })
      }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status.toString())) {
      if (!validator.isIn(this.status.toLowerCase(), ORDER_STATUS_VALUES)) {
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
    let orderObject = this
    const fieldsToClean = ["totalCost", "shippingFee", "finalCost", "currency","paymentMethod","voucherCode", "status"]
    for (const [key, value] of Object.entries(orderObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "totalCost" ||key === "shippingFee" || key === "finalCost") {
            orderObject[key] = parseFloat(validator.trim(value.toString()))
          }
          if (key === "currency" || key === "paymentMethod" || key === 'voucherCode') {
            orderObject[key] = validator.trim(value.toString().toUpperCase())
          }
          if (key === "status") {
            orderObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }

        if (key === "updatedAt") {
          orderObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete orderObject[key]
      }
    }

    return orderObject
  }

  static async create({ ...orderData }) {
    try {
      let orderObject = new OrderObject({ ...orderData })
      console.log(orderObject)
      orderObject = orderObject.clean()
      console.log(orderObject)
      const validation = await orderObject.validate("create")
      if (validation) {
        const createdOrder = await OrderModel.create({ ...validation })
        if (createdOrder) {
          const order = new OrderObject({ ...createdOrder })
          return order
        }
      }

      throw new Error("Failed to create order.")
    } catch (error) {
      throw error
    }
  }

  async update(updateData = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "OrderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    if (!(await isExistent(OrderModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "OrderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let updateObject = new OrderObject({ ...updateData })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update")
      if (validation) {
        const updated = new OrderObject(
          await OrderModel.findOneAndUpdate({ _id: this.id }, { ...validation }, { new: true })
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
        objectName: "OrderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isSaved = await OrderModel.findOneAndUpdate({ _id: this.id }).lean()
      if (isSaved) {
        return new OrderObject({ ...isSaved })
      }

      throw new Error("Failed to save order.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "OrderObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isRemoved = await OrderModel.findOneAndDelete({ _id: this.id }).lean()
      if (isRemoved) {
        return new OrderObject({ ...isRemoved })
      }

      throw new Error("Failed to remove order.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = OrderObject
