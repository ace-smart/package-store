const validator = require("validator")
const { hasUnknownKeys, isExistent  } = require("./validation")
const {  ORDER_FIELDS, ORDER_STATUS_VALUES } = require("./_fields")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(ORDER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // totalCost [required]
    if (typeof data.totalCost === "undefined" || validator.isEmpty(data.totalCost)) {
        throw new Error("totalCost is required.")
    }
    if (!validator.isNumeric(data.totalCost.toString())) {
        throw new Error("totalCost must contain only numbers.")
    }
    if (!validator.isLength(data.totalCost.toString(),{min: 1})) {
        throw new Error("totalCost must larger 0 .")
    }
    // shippingFee [required]
    if (typeof data.shippingFee === "undefined" || validator.isEmpty(data.shippingFee)) {
        throw new Error("shippingFee is required.")
    }
    if (!validator.isNumeric(data.shippingFee.toString())) {
        throw new Error("shippingFee must contain only numbers.")
    }
    // finalCost [required]
    if (typeof data.finalCost === "undefined" || validator.isEmpty(data.finalCost)) {
        throw new Error("finalCost is required.")
    }
    if (!validator.isNumeric(data.finalCost.toString())) {
        throw new Error("finalCost must contain only numbers.")
    }
    // currency
    if (typeof data.currency !== "undefined" && !validator.isEmpty(data.currency)) {
        if (!validator.isAlpha(data.currency)) {
            throw new Error("currency must contain only alphabetic characters. (eg. USD, CADm EUR)")
        }
        if (!validator.isLength(data.currency, {max: 6})) {
            throw new Error("currency must be under 6 characters.")
        }
    }
    // paymentMethod [required]
    if (typeof data.paymentMethod === "undefined" || validator.isEmpty(data.paymentMethod)) {
        throw new Error("paymentMethod is required.")
    }
    if (!validator.isAlpha(data.paymentMethod)) {
        throw new Error("paymentMethod must contain only alphabetic characters.")
    }
    if (!validator.isLength(data.paymentMethod, {max: 30})) {
        throw new Error("paymentMethod must be under 30 characters.")
    }
    // userId [required]
    if (typeof data.userId === "undefined" || validator.isEmpty(data.userId)) {
        throw new Error("userId is required.")
    }
    if (!validator.isMongoId(data.userId)) {
        throw new Error("userId has invalid format.")
    }
    if (!isExistent(require('../models/UserModel'),{_id: data.userId})) {
        throw new Error("userId is not existent.")
    }
    // voucherCode 
    if (typeof data.voucherCode !== "undefined" && !validator.isEmpty(data.voucherCode)) {
        if (!validator.isAlphanumeric(data.voucherCode)) {
            throw new Error("voucherCode be only alphabetic characters.")
        }
        if (!await isExistent(require('../models/VoucherModel'),{code: data.voucherCode.toString()})) {
            throw new Error("voucherCode is not existent.")
        }
    }
   
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), ORDER_STATUS_VALUES)) {
            throw new Error("Status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, orderId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(ORDER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // totalCost
    if (typeof data.totalCost !== "undefined" && !validator.isEmpty(data.totalCost)) {
        if (!validator.isNumeric(data.totalCost.toString())) {
            throw new Error("totalCost must contain only numbers.")
        }
    }
    // shippingFee 
    if (typeof data.shippingFee !== "undefined" && !validator.isEmpty(data.shippingFee)) {
        if (!validator.isNumeric(data.shippingFee.toString())) {
            throw new Error("shippingFee must contain only numbers.")
        }
    }
    // finalCost
    if (typeof data.finalCost !== "undefined" && !validator.isEmpty(data.finalCost)) {
        if (!validator.isNumeric(data.finalCost.toString())) {
            throw new Error("finalCost must contain only numbers.")
        }
    }
    // currency
    if (typeof data.currency !== "undefined" && !validator.isEmpty(data.currency)) {
        if (!validator.isAlpha(data.currency)) {
            throw new Error("currency must contain only alphabetic characters. (eg. USD, CADm EUR)")
        }
        if (!validator.isLength(data.currency, {max: 6})) {
            throw new Error("currency must be under 6 characters.")
        }
    }
    // paymentMethod
    if (typeof data.paymentMethod !== "undefined" && !validator.isEmpty(data.paymentMethod)) {
        if (!validator.isAlpha(data.paymentMethod)) {
            throw new Error("paymentMethod must contain only alphabetic characters.")
        }
        if (!validator.isLength(data.paymentMethod, {max: 30})) {
            throw new Error("paymentMethod must be under 30 characters.")
        }
    }
    
    // userId
    if (typeof data.userId !== "undefined" && !validator.isEmpty(data.userId)) {
        if (!validator.isMongoId(data.userId)) {
            throw new Error("userId has invalid format.")
        }
        if (!isExistent(require('../models/UserModel'),{_id: data.userId})) {
            throw new Error("userId is not existent.")
        }
    }
    // voucherCode 
    if (typeof data.voucherCode !== "undefined" && !validator.isEmpty(data.voucherCode)) {
        if (!validator.isAlphanumeric(data.voucherCode)) {
            throw new Error("voucherCode be only alphabetic characters.")
        }
        if (!await isExistent(require('../models/VoucherModel'),{code: data.voucherCode.toString()})) {
            throw new Error("voucherCode is not existent.")
        }
    }
    
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), ORDER_STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }
    return true
}

module.exports = { validate_add_inp, validate_update_inp }
