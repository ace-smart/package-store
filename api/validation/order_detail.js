const validator = require("validator")
const { hasUnknownKeys, isExistent  } = require("./validation")
const {  ORDER_DETAILS_FIELDS, STATUS_VALUES } = require("./_fields")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(ORDER_DETAILS_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // productId [required]
    if (typeof data.productId === "undefined" || validator.isEmpty(data.productId)) {
        throw new Error("productId is required.")
    }
    if (!validator.isMongoId(data.productId)) {
        throw new Error("productId has invalid format.")
    }
    if (!isExistent(require('../models/ProductModel'),{_id: data.productId})) {
        throw new Error("productId is not existent.")
    }
    // totalCost [required]
    if (typeof data.totalCost === "undefined" || validator.isEmpty(data.totalCost)) {
        throw new Error("totalCost is required.")
    }
    if (!validator.isNumeric(data.totalCost.toString())) {
        throw new Error("totalCost must contain only numbers.")
    }
    if (!validator.isLength(data.totalCost.toString(),{min: 1})) {
        throw new Error("totalCost must larger than 0 .")
    }
    // amount
    if (typeof data.amount !== "undefined" && !validator.isEmpty(data.amount)) {
        if (!validator.isNumeric(data.amount.toString())) {
            throw new Error("amount must contain only numbers.")
        }
        if (parseInt(data.amount.toString()) <= 0) {
            throw new Error("amount must larger than 0 .")
        }
    }
    
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, orderDetailId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(ORDER_DETAILS_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // productId 
    if (typeof data.productId !== "undefined" && !validator.isEmpty(data.productId)) {
        if (!validator.isMongoId(data.productId)) {
            throw new Error("productId has invalid format.")
        }
        if (!isExistent(require('../models/ProductModel'),{_id: data.productId})) {
            throw new Error("productId is not existent.")
        }
    }
    
    // totalCost
    if (typeof data.totalCost !== "undefined" && !validator.isEmpty(data.totalCost)) {
        if (!validator.isNumeric(data.totalCost.toString())) {
            throw new Error("totalCost must contain only numbers.")
        }
        if (!validator.isLength(data.totalCost.toString(),{min: 1})) {
            throw new Error("totalCost must larger than 0 .")
        }
    }
    
    // amount
    if (typeof data.amount !== "undefined" && !validator.isEmpty(data.amount)) {
        if (!validator.isNumeric(data.amount.toString())) {
            throw new Error("amount must contain only numbers.")
        }
        if (parseInt(data.amount.toString()) <= 0) {
            throw new Error("amount must larger than 0 .")
        }
    }
    
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }

    return true
}

module.exports = { validate_add_inp, validate_update_inp }
