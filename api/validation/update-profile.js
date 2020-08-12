const validator = require("validator")
const { hasUnknownKeys, STATUS_VALUES, PROFILE_FIELDS, PROFILE_GENDER_VALUES } 
    = require("./validation")

module.exports = function validate({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(PROFILE_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    if (typeof data.firstName !== "undefined" && !validator.isEmpty(data.firstName)) {
        if (!validator.isAlpha(data.firstName)) {
            throw new Error("firstName must be alphabetic characters.")
        }
        if (!validator.isLength(data.firstName, { min: 3, max: 30 })) {
            throw new Error("firstName must be from 3 to 30 characters.")
        }
    }
    if (typeof data.lastName !== "undefined" && !validator.isEmpty(data.lastName)) {
        if (!validator.isAlpha(data.lastName)) {
            throw new Error("lastName must be alphabetic characters.")
        }
        if (!validator.isLength(data.lastName, { min: 3, max: 30 })) {
            throw new Error("lastName must be from 3 to 30 characters.")
        }
    }
    if (typeof data.gender !== "undefined" && !validator.isEmpty(data.gender)) {
        if (!validator.isIn(data.gender, PROFILE_GENDER_VALUES)) {
            throw new Error("gender only accepts [male, female, lgbt]")
        }
    }
    if (typeof data.dateOfBirth !== "undefined" && !validator.isEmpty(data.dateOfBirth)) {
        if (!validator.isDate(data.dateOfBirth)) {
            throw new Error("dateOfBirth is in invalid format [YYYY/MM/DD]")
        }
        if (!validator.isAfter(data.dateOfBirth, new Date(2004, 1, 1))) {
            throw new Error("dateOfBirth is invalid, age must be over 16")
        }
    }
    if (typeof data.phoneNumber !== "undefined" && !validator.isEmpty(data.phoneNumber)) {
        if (!validator.isNumeric(data.phoneNumber)) {
            throw new Error("phoneNumber is in invalid format")
        }
    }
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }
    return true
}
