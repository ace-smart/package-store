const OrderModel = require("../models/OrderModel")
const UserModel = require("../models/UserModel")
const VoucherModel = require("../models/VoucherModel")
const { isExistent } = require("../helper/validation")
const validator = require("validator")
const ValidationError = require("../errors/validation")
const OrderDetailObject = require("./OrderDetailObject")
const OrderDetailModel = require("../models/OrderDetailModel")
const ORDER_STATUS_VALUES = ["processing", "packing", "delivering", "done", "cancelled"]

class OrderObject {
  constructor({
    _id,
    totalCost,
    shippingFee,
    finalCost,
    paymentMethod,
    userId,
    voucherId,
    deliveryDay,
    orderDetails = [],
    status,
    createdAt,
  }) {
    this.id = _id
    this.totalCost = totalCost
    this.shippingFee = shippingFee
    this.finalCost = finalCost
    this.paymentMethod = paymentMethod
    this.userId = userId
    this.voucherId = voucherId != "" ? voucherId : undefined
    this.deliveryDay = deliveryDay
    this.orderDetails = orderDetails
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneOrderBy(criteria = {}, selectFields = null) {
    try {
      let order = await OrderModel.findOne(criteria, selectFields)
        .populate({ path: "userId", select: "username role email profileId" })
        .populate({
          path: "voucherId",
          select: "name code rate status minValue maxValue validUntil",
        })
        .lean()

      if (order) {
        order.orderDetails = []
        const details = await OrderDetailObject.getOrderDetailsBy({ orderId: order._id })
        if (details && details.length > 0) {
          details.forEach((detail) => order.orderDetails.push(detail))
        }

        return new OrderObject({ ...order })
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getOrdersBy(criteria = {}, selectFields = null) {
    try {
      const orders = await OrderModel.find(criteria, selectFields)
        .populate({ path: "userId", select: "username role email profileId" })
        .populate({
          path: "voucherId",
          select: "name code rate status minValue maxValue validUntil",
        })
        .sort({ createdAt: -1 })
        .lean()

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
    if (this.totalCost != null && !validator.isEmpty(this.totalCost.toString())) {
      if (!validator.isNumeric(this.totalCost.toString())) {
        errors.push({
          field: "totalCost",
          message: "Must contain only numbers.",
          value: this.totalCost,
        })
      }
    }
    // shippingFee
    if (this.shippingFee != null && !validator.isEmpty(this.shippingFee.toString())) {
      if (!validator.isNumeric(this.shippingFee.toString())) {
        errors.push({
          field: "shippingFee",
          message: "Must contain only numbers.",
          value: this.shippingFee,
        })
      }
    }
    // finalCost
    if (this.finalCost != null && !validator.isEmpty(this.finalCost.toString())) {
      if (!validator.isNumeric(this.finalCost.toString())) {
        errors.push({
          field: "finalCost",
          message: "Must contain only numbers.",
          value: this.finalCost,
        })
      }
    }
    // paymentMethod
    if (this.paymentMethod != null && !validator.isEmpty(this.paymentMethod.toString())) {
      if (!validator.isAlpha(this.paymentMethod)) {
        errors.push({
          field: "paymentMethod",
          message: "Must contain only alphabetic characters.",
          value: this.paymentMethod,
        })
      }
      if (!validator.isLength(this.paymentMethod, { max: 30 })) {
        errors.push({
          field: "paymentMethod",
          message: "Must be under 30 characters.",
          value: this.paymentMethod,
        })
      }
    }
    // userId
    if (this.userId != null && !validator.isEmpty(this.userId.toString())) {
      if (!validator.isMongoId(this.userId)) {
        errors.push({
          field: "userId",
          message: "Invalid format.",
          value: this.userId,
        })
      }
      if (!isExistent(UserModel, { _id: this.userId })) {
        errors.push({
          field: "userId",
          message: "Invalid value.",
          value: this.userId,
        })
      }
    }
    // voucherCode
    if (this.voucherCode != null && !validator.isEmpty(this.voucherCode.toString())) {
      if (!validator.isMongoId(this.voucherCode)) {
        errors.push({
          field: "voucherCode",
          message: "Invalid format.",
          value: this.voucherCode,
        })
      }
      if (!isExistent(VoucherModel, { _id: this.voucherCode })) {
        errors.push({
          field: "voucherCode",
          message: "Invalid value.",
          value: this.voucherCode,
        })
      }
    }
    // deliverDay
    if (this.deliveryDay != null && !validator.isEmpty(this.deliveryDay.toString())) {
      if (!validator.isDate(this.deliveryDay)) {
        errors.push({
          field: "deliveryDay",
          message: "Invalid format [YYYY/MM/DD]",
          value: this.deliveryDay,
        })
      }
      if (!validator.isAfter(this.deliveryDay.toString(), new Date().toString())) {
        errors.push({
          field: "deliveryDay",
          message: "Invalid value.",
          value: this.deliveryDay,
        })
      }
    }
    // status
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
      if (!validator.isIn(this.status.toLowerCase(), ORDER_STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Value is not valid.",
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

  clean() {
    let orderObject = this
    const fieldsToClean = ["totalCost", "shippingFee", "finalCost", "paymentMethod", "status"]
    for (const [key, value] of Object.entries(orderObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "totalCost" || key === "shippingFee" || key === "finalCost") {
            orderObject[key] = parseFloat(validator.trim(value.toString()))
          }
          if (key === "paymentMethod") {
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
      const validation = await orderObject.validate("create")
      if (validation) {
        orderObject = orderObject.clean()
        const createdOrder = await OrderModel.create({ ...orderObject })
        if (createdOrder) {
          // Create order details
          if (orderData.orderDetails.length < 1) {
            await OrderModel.findOneAndDelete({ _id: createdOrder._id })
            throw new Error("Failed to create order with no detail.")
          } else {
            orderData.orderDetails.forEach(async (element) => {
              await OrderDetailObject.create({
                ...element,
                orderId: createdOrder._id,
              })
            })

            return new OrderObject({ ...createdOrder._doc })
          }
        }
      }

      throw new Error("Failed to create order.")
    } catch (error) {
      throw error
    }
  }

  async update({ ...updateData }) {
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
      const validation = await updateObject.validate("update")
      if (validation) {
        updateObject = updateObject.clean()
        const updated = await OrderModel.findOneAndUpdate(
          { _id: this.id },
          { ...updateObject },
          { new: true }
        ).lean()

        if (updated) {
          // Update order details
          updateObject.orderDetails.forEach(async (element) => {
            if (element.id != null) {
              // Remove
              const detailsFromDb = await OrderDetailModel.find({ orderId: updated._id }).lean()
              detailsFromDb.forEach(async (detail) => {
                if (detail._id != element.id) {
                  await OrderDetailModel.findOneAndDelete({ _id: detail._id })
                } else {
                  // Update
                  const orderDetail = await OrderDetailObject.getOneOrderDetailBy({
                    _id: element.id,
                  })
                  await orderDetail.update({ ...element })
                }
              })
            } else {
              // Add
              await OrderDetailObject.create({ ...element, orderId: updated._id.toString() })
            }
          })

          return new OrderObject({ ...updated })
        }
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
