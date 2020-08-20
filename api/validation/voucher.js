const validator = require("validator")
const { hasUnknownKeys, isExistent, hasSpecialChars } = require("./validation")
const { VOUCHER_FIELDS, VOUCHER_LIMIT_TYPE } = require("./_fields")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(VOUCHER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // name [required]
    if (typeof data.name === "undefined" || validator.isEmpty(data.name)) {
        throw new Error("name is required.")
    }
    if (hasSpecialChars(validator.trim(data.name))) {
        throw new Error("name must contain only numbers.")
    }
    if (!validator.isLength(validator.trim(data.name), { max: 200 })) {
        throw new Error("name must be under 200 characters.")
    }
    // description
    if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
        if (hasSpecialChars(validator.trim(data.description))) {
            throw new Error("description must contain only numbers.")
        }
        if (!validator.isLength(validator.trim(data.description), { max: 350 })) {
            throw new Error("description must be under 350 characters.")
        }
    }
    // code [required]
    if (typeof data.code === "undefined" || validator.isEmpty(data.code)) {
        throw new Error("code is required.")
    }
    if (!validator.isAlphanumeric(validator.trim(data.code))) {
        throw new Error("code must contain only numbers and letters. (no spaces)")
    }
    if (!validator.isLength(validator.trim(data.code), { max: 30 })) {
        throw new Error("code must be under 30 characters.")
    }
    if (
        await isExistent(require("../models/VoucherModel"), {
            code: validator.trim(data.code.toUpperCase()),
        })
    ) {
        throw new Error("code is already existent.")
    }
    // rate
    if (typeof data.rate !== "undefined" && !validator.isEmpty(data.rate)) {
        if (!validator.isNumeric(data.rate.toString())) {
            throw new Error("rate must contain only numbers.")
        }
    }
    // minValue [required]
    if (typeof data.minValue === "undefined" || validator.isEmpty(data.minValue)) {
        throw new Error("minValue is required.")
    }
    if (!validator.isNumeric(data.minValue.toString())) {
        throw new Error("minValue must contain only numbers.")
    }
    // maxValue [required]
    if (typeof data.maxValue === "undefined" || validator.isEmpty(data.maxValue)) {
        throw new Error("maxValue is required.")
    }
    if (!validator.isNumeric(data.maxValue.toString())) {
        throw new Error("maxValue must contain only numbers.")
    }
    // usageLimit
    if (typeof data.usageLimit !== "undefined") {
        if (
            JSON.stringify(data.usageLimit) === "{}" ||
            typeof data.usageLimit === "string" ||
            data.usageLimit.limitType == null ||
            data.usageLimit.maxOfUse == null
        ) {
            throw new Error("usageLimit must contain two properties {limitType, maxOfUse}")
        }
        if (!validator.isAlpha(data.usageLimit.limitType.toString())) {
            throw new Error("usageLimit.limitType must contain only alphabetic characters.")
        }
        const validTypes = VOUCHER_LIMIT_TYPE.find((ele) => {
            return ele === data.usageLimit.limitType.toString()
        })
        if (validTypes == null) {
            throw new Error(
                `Invalid input [${data.usageLimit.limitType.toString()}] for usageLimit.limitType`
            )
        }
        if (!validator.isNumeric(data.usageLimit.maxOfUse.toString())) {
            throw new Error("usageLimit.maxOfUse must be numbers.")
        }
    }
    // validUntil [required]
    if (typeof data.validUntil === "undefined" || validator.isEmpty(data.validUntil)) {
        throw new Error("validUntil is required.")
    }
    if (!validator.isDate(data.validUntil)) {
        throw new Error("validUntil has invalid format. [YYYY/MM/DD]")
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("Status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, voucherId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(VOUCHER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // name
    if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
        if (hasSpecialChars(validator.trim(data.name))) {
            throw new Error("name must contain only numbers.")
        }
        if (!validator.isLength(validator.trim(data.name), { max: 200 })) {
            throw new Error("name must be under 200 characters.")
        }
    }
    // description
    if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
        if (hasSpecialChars(validator.trim(data.description))) {
            throw new Error("description must contain only numbers.")
        }
        if (!validator.isLength(validator.trim(data.description), { max: 350 })) {
            throw new Error("description must be under 350 characters.")
        }
    }
    // code
    if (typeof data.code !== "undefined" && !validator.isEmpty(data.code)) {
        if (!validator.isAlphanumeric(validator.trim(data.code))) {
            throw new Error("code must contain only numbers and letters. (no spaces)")
        }
        if (!validator.isLength(validator.trim(data.code), { max: 30 })) {
            throw new Error("code must be under 30 characters.")
        }
        if (
            (await isExistent(require("../models/VoucherModel"), {
                code: validator.trim(data.code.toUpperCase()),
            },voucherId))
        ) {
            throw new Error("code is already existent.")
        }
    }

    // rate
    if (typeof data.rate !== "undefined" && !validator.isEmpty(data.rate)) {
        if (!validator.isNumeric(data.rate.toString())) {
            throw new Error("rate must contain only numbers.")
        }
    }
    // minValue
    if (typeof data.minValue !== "undefined" && !validator.isEmpty(data.minValue)) {
        if (!validator.isNumeric(data.minValue.toString())) {
            throw new Error("minValue must contain only numbers.")
        }
    }
    // maxValue
    if (typeof data.maxValue !== "undefined" && !validator.isEmpty(data.maxValue)) {
        if (!validator.isNumeric(data.maxValue.toString())) {
            throw new Error("maxValue must contain only numbers.")
        }
    }
    
    // usageLimit
    if (typeof data.usageLimit !== "undefined") {
        if (
            JSON.stringify(data.usageLimit) === "{}" ||
            typeof data.usageLimit === "string" ||
            data.usageLimit.limitType == null ||
            data.usageLimit.maxOfUse == null
        ) {
            throw new Error("usageLimit must contain two properties {limitType, maxOfUse}")
        }
        if (!validator.isAlpha(data.usageLimit.limitType.toString())) {
            throw new Error("usageLimit.limitType must contain only alphabetic characters.")
        }
        const validTypes = VOUCHER_LIMIT_TYPE.find((ele) => {
            return ele === data.usageLimit.limitType.toString()
        })
        if (validTypes == null) {
            throw new Error(
                `Invalid input [${data.usageLimit.limitType.toString()}] for usageLimit.limitType`
            )
        }
        if (!validator.isNumeric(data.usageLimit.maxOfUse.toString())) {
            throw new Error("usageLimit.maxOfUse must be numbers.")
        }
    }
    // validUntil
    if (typeof data.validUntil !== "undefined" && !validator.isEmpty(data.validUntil)) {
        if (!validator.isDate(data.validUntil)) {
            throw new Error("validUntil has invalid format. [YYYY/MM/DD]")
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
