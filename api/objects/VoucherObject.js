const VoucherModel = require("../models/VoucherModel")
const validator = require("validator")
const { isExistent, hasSpecialChars, STATUS_VALUES } = require("../helper/validation")
const VOUCHER_LIMIT_TYPE = ["daily", "weekly", "seasonal", "unlimited", "personal", "manually"]
const ValidationError = require('../errors/validation')

class VoucherObject {
  constructor({
    _id,
    name,
    code,
    rate,
    minValue,
    maxValue,
    usageLimit,
    validUntil,
    description,
    status,
    createdAt,
  }) {
    this.id = _id
    this.name = name
    this.code = code
    this.rate = rate
    this.minValue = minValue
    this.maxValue = maxValue
    this.usageLimit = usageLimit
    this.validUntil = validUntil
    this.description = description
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
    if (typeof this.name !== "undefined" && !validator.isEmpty(this.name)) {
      if (hasSpecialChars(this.name)) {
        errors.push({
          field: "name",
          message: "Must contain only numbers,characters and spaces.",
        })
      }
      if (!validator.isLength(this.name, { max: 200 })) {
        errors.push({
          field: "name",
          message: "Must be under 200 characters.",
        })
      }
      if (
        await isExistent(
          VoucherModel,
          {
            name: this.name,
          },
          exceptionId
        )
      ) {
        errors.push({
          field: "name",
          message: "Already existent.",
        })
      }
    }
    // code
    if (typeof this.code !== "undefined" && !validator.isEmpty(this.code)) {
      if (!validator.isAlphanumeric(validator.trim(this.code))) {
        errors.push({
          field: "code",
          message: "Must contain only numbers and letters. (no spaces)",
        })
      }
      if (!validator.isLength(validator.trim(this.code), { max: 30 })) {
        errors.push({
          field: "code",
          message: "Must be under 30 characters.",
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
          message: "Must contain only numbers."
        })
      }
    }
    // minValue
    if (typeof this.minValue !== "undefined" && !validator.isEmpty(this.minValue.toString())) {
      if (!validator.isNumeric(this.minValue.toString())) {
        errors.push({
          field: "minValue",
          message: "Must contain only numbers."
        })
      }
    }
    // maxValue
    if (typeof this.maxValue !== "undefined" && !validator.isEmpty(this.maxValue.toString())) {
      if (!validator.isNumeric(this.maxValue.toString())) {
        errors.push({
          field: "maxValue",
          message: "Must contain only numbers."
        })
      }
    }

    // usageLimit
    if (typeof this.usageLimit !== "undefined") {
      if (
        JSON.stringify(this.usageLimit) === "{}" ||
        typeof this.usageLimit === "string" ||
        this.usageLimit.limitType == null ||
        this.usageLimit.maxOfUse == null
      ) {
        errors.push({
          field: "usageLimit",
          message: "Must contain two properties {limitType, maxOfUse}."
        })
      }
      if (!validator.isAlpha(this.usageLimit.limitType.toString())) {
        errors.push({
          field: "usageLimit.limitType",
          message: "Must contain only alphabetic characters."
        })
      }
      const validTypes = VOUCHER_LIMIT_TYPE.find((ele) => {
        return ele === this.usageLimit.limitType.toString()
      })
      if (validTypes == null) {
        errors.push({
          field: "usageLimit.limitType",
          message: "Invalid value."
        })
      }
      if (!validator.isNumeric(this.usageLimit.maxOfUse.toString())) {
        errors.push({
          field: "usageLimit.maxOfUse",
          message: "Must be numbers."
        })
      }
    }
    // validUntil
    if (typeof this.validUntil !== "undefined" && !validator.isEmpty(this.validUntil)) {
      if (!validator.isDate(this.validUntil)) {
        errors.push({
          field: "validUntil",
          message: "Invalid format. [YYYY/MM/DD]"
        })
      }
    }
    // description
    if (typeof this.description !== "undefined" && !validator.isEmpty(this.description)) {
      if (hasSpecialChars(validator.trim(this.description))) {
        errors.push({
          field: "description",
          message: "Must contain only numbers.",
        })
      }
      if (!validator.isLength(validator.trim(this.description), { max: 350 })) {
        errors.push({
          field: "description",
          message: "Must be under 350 characters.",
        })
      }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status)) {
      if (!validator.isIn(this.status.toLowerCase(), STORAGE_STATUS_VALUES)) {
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
    let voucherObject = this
    const fieldsToClean = ["name", "code", "rate", "minValue", "maxValue", "usageLimit", "description", "status"]
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
          if (key === "usageLimit") {
            if (value.limitType != null) {
              voucherObject[key].limitType = validator.trim(value.limitType.toString().toLowerCase())
            }
            if (value.maxOfUse != null) {
              voucherObject[key].maxOfUse = parseInt(validator.trim(value.maxOfUse.toString()))
            }
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
