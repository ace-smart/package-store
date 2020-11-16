const VoucherModel = require("../models/VoucherModel")
const validator = require("validator")
const { isExistent, hasSpecialChars, STATUS_VALUES } = require("../helper/validation")
const ValidationError = require('../errors/validation')
const helper = require('../helper/format')

class VoucherObject {
  constructor({
    _id,
    name,
    code,
    rate,
    minValue,
    maxValue,
    validUntil,
    status,
    createdAt,
  }) {
    this.id = _id
    this.name = name
    this.code = code
    this.rate = rate
    this.minValue = minValue
    this.maxValue = maxValue
    this.validUntil = validUntil
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneVoucherBy(criteria = {}, selectFields = null) {
    try {
      let voucher = await VoucherModel.findOne(criteria, selectFields).lean()
      if (voucher) {
        voucher = new VoucherObject({ ...voucher })
        return voucher
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getVouchersBy(criteria = {}, selectFields = null) {
    try {
      const vouchers = await VoucherModel.find(criteria, selectFields).lean()
      if (vouchers.length > 0) {
        let voucherList = new Array()

        vouchers.forEach((element) => {
          const object = new VoucherObject({ ...element })
          voucherList.push(object)
        })

        return voucherList
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
      if (this.code == null || validator.isEmpty(this.code.toString())) {
        errors.push({
          field: "code",
          message: "Must be required.",
        })
      }
      if (this.minValue == null || validator.isEmpty(this.minValue.toString())) {
        errors.push({
          field: "minValue",
          message: "Must be required.",
        })
      }
      if (this.maxValue == null || validator.isEmpty(this.maxValue.toString())) {
        errors.push({
          field: "maxValue",
          message: "Must be required.",
        })
      }
      if (this.validUntil == null) {
        errors.push({
          field: "validUntil",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // name
    if (typeof this.name !== "undefined" && !validator.isEmpty(this.name.toString())) {
      if (hasSpecialChars(this.name.toString())) {
        errors.push({
          field: "name",
          message: "Must contain only numbers,characters and spaces.",
          value: this.name
        })
      }
      if (!validator.isLength(this.name, { max: 200 })) {
        errors.push({
          field: "name",
          message: "Must be under 200 characters.",
          value: this.name
        })
      }
      if (await isExistent(VoucherModel,{name: this.name}, exceptionId)) {
        errors.push({
          field: "name",
          message: "Already existent.",
          value: this.name
        })
      }
    }

    // code
    if (typeof this.code !== "undefined" && !validator.isEmpty(this.code)) {
      if (!validator.isAlphanumeric(validator.trim(this.code))) {
        errors.push({
          field: "code",
          message: "Must contain only numbers and letters. (no spaces)",
          value: this.code
        })
      }
      if (!validator.isLength(validator.trim(this.code), { max: 30 })) {
        errors.push({
          field: "code",
          message: "Must be under 30 characters.",
          value: this.code
        })
      }
      if (
        await isExistent(
          VoucherModel,
          {
            code: validator.trim(this.code.toUpperCase()),
          },
          exceptionId
        )
      ) {
        errors.push({
          field: "code",
          message: "Already existent.",
        })
      }
    }

    // rate
    if (typeof this.rate !== "undefined" && !validator.isEmpty(this.rate.toString())) {
      if (!validator.isNumeric(this.rate.toString())) {
        errors.push({
          field: "rate",
          message: "Must contain only numbers.",
          value: this.rate
        })
      }
      if (parseInt(this.rate.toString()) < 0) {
        errors.push({
          field: "rate",
          message: "Must be positive number (> 0).",
          value: this.rate
        })
      }
    }
    // minValue
    if (typeof this.minValue !== "undefined" && !validator.isEmpty(this.minValue.toString())) {
      if (!validator.isNumeric(this.minValue.toString())) {
        errors.push({
          field: "minValue",
          message: "Must contain only numbers.",
          value: this.minValue
        })
      }
      if (parseInt(this.minValue.toString()) < 0) {
        errors.push({
          field: "minValue",
          message: "Must be greater than 0",
          value: this.minValue
        })
      }
    }
    // maxValue
    if (typeof this.maxValue !== "undefined" && !validator.isEmpty(this.maxValue.toString())) {
      if (!validator.isNumeric(this.maxValue.toString())) {
        errors.push({
          field: "maxValue",
          message: "Must contain only numbers.",
          value: this.maxValue
        })
      }
      if (parseInt(this.maxValue.toString()) < 0) {
        errors.push({
          field: "maxValue",
          message: "Must be greater than 0",
          value: this.maxValue
        })
      }
    }
    // validUntil
    if (typeof this.validUntil !== "undefined" && !validator.isEmpty(this.validUntil)) {
      if (!validator.isDate(this.validUntil)) {
        errors.push({
          field: "validUntil",
          message: "Invalid format. [YYYY/MM/DD]",
          value: this.validUntil
        })
      }
      if (!validator.isAfter(
          this.validUntil,
          helper.toFormatDateStr()
        )
      ) {
        errors.push({
          field: "validUntil",
          message: "Invalid date. Must be after the present day",
          value: this.validUntil,
        })
      }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status)) {
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
    let voucherObject = this
    const fieldsToClean = ["name", "code", "rate", "minValue", "maxValue","description", "status"]
    for (const [key, value] of Object.entries(voucherObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "name" || key === "description" ) {
            voucherObject[key] = validator.trim(value.toString())
          }
          if (key === "status") {
            voucherObject[key] = validator.trim(value.toString().toLowerCase())
          }
          if (key === "code") {
            voucherObject[key] = validator.trim(value.toString().toUpperCase())
          }
          if (key === "rate" || key === "minValue" || key === "maxValue") {
            voucherObject[key] = parseFloat(validator.trim(value.toString()))
          }
        }

        if (key === "updatedAt") {
          voucherObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete voucherObject[key]
      }
    }

    return voucherObject
  }

  static async create({ ...voucherData }) {
    try {
      let voucherObject = new VoucherObject({ ...voucherData })
      voucherObject = voucherObject.clean()
      const validation = await voucherObject.validate("create")
      if (validation) {
        const createdVoucher = await VoucherModel.create({ ...validation })
        if (createdVoucher) {
          const voucher = new VoucherObject({ ...createdVoucher })
          return voucher
        }
      }

      throw new Error("Failed to create voucher.")
    } catch (error) {
      throw error
    }
  }

  async update(updateData = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "VoucherObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    if (!(await isExistent(VoucherModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "VoucherObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let updateObject = new VoucherObject({ ...updateData })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        const updated = new VoucherObject(
          await VoucherModel.findOneAndUpdate({ _id: this.id }, { ...validation }, { new: true })
        )

        return updated
      }

      throw new Error("Failed to update voucher.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "VoucherObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isSaved = await VoucherModel.findOneAndUpdate({ _id: this.id }).lean()
      if (isSaved) {
        return new VoucherObject({ ...isSaved })
      }

      throw new Error("Failed to save voucher.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "VoucherObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const isRemoved = await VoucherModel.findOneAndDelete({ _id: this.id }).lean()
      if (isRemoved) {
        return new VoucherObject({ ...isRemoved })
      }

      throw new Error("Failed to remove voucher.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = VoucherObject
