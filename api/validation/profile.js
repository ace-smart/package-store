const validator = require('validator')
const {toFormatDateStr} = require('../helper/format')
const { hasUnknownKeys  } = require("./validation")
const { STATUS_VALUES, PROFILE_FIELDS, PROFILE_GENDER_VALUES } = require("./_fields")
const {InvalidError, UnknownInputError} = require('./error')

function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(PROFILE_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new UnknownInputError(unknownKeys)
    }
    // firstName [required]
    if (typeof data.firstName === "undefined" || validator.isEmpty(data.firstName)) {
        throw new InvalidError('firstName', data.firstName.toString(), "Must be required.")
    }
    if (!validator.isAlpha(data.firstName)) {
        throw new InvalidError('firstName', data.firstName.toString(), "Must be alphabetic characters.")
    }
    if (!validator.isLength(data.firstName, { min: 3, max: 30 })) {
        throw new InvalidError('firstName', data.firstName.toString(), "Must be from 3 to 30 characters.")
    }
    // lastName [required]
    if (typeof data.lastName === "undefined" || validator.isEmpty(data.lastName)) {
        throw new InvalidError('lastName', data.lastName.toString(), "Must be required.")
    }
    if (!validator.isAlpha(data.lastName)) {
        throw new InvalidError('lastName', data.lastName.toString(), "Must be alphabetic characters.")
    }
    if (!validator.isLength(data.lastName, { min: 3, max: 30 })) {
        throw new InvalidError('lastName', data.lastName.toString(), "Must be from 3 to 30 characters.")
    }
    // gender [required]
    if (typeof data.gender === "undefined" || validator.isEmpty(data.gender)) {
        throw new InvalidError('gender', data.gender.toString(), "Must be required.")
    }
    if (!validator.isAlpha(data.gender)) {
        throw new InvalidError('gender', data.gender.toString(), "Must be alphabetic characters.")
    }
    if (!validator.isIn((data.gender.toLowerCase()), PROFILE_GENDER_VALUES)) {
        throw new InvalidError('gender', data.gender.toString(), "Only accepts [male, female, lgbt]")
    }
    // dateOfBirth [required]
    if (typeof data.dateOfBirth === "undefined" || validator.isEmpty(data.dateOfBirth)) {
        throw new InvalidError('dateOfBirth', data.dateOfBirth.toString(), "Must be required.")
    }
    if (!validator.isDate(data.dateOfBirth)) {
        throw new InvalidError('dateOfBirth', data.dateOfBirth.toString(), "Must be in format [YYYY/MM/DD]")
    }
    if (!validator.isBefore(data.dateOfBirth, toFormatDateStr(new Date(new Date().getFullYear()-16,0,1)))) {
        throw new InvalidError('dateOfBirth', data.dateOfBirth.toString(), "Must be over 16 years old")
    }
    // phoneNumber [required]
    if (typeof data.phoneNumber === "undefined" || validator.isEmpty(data.phoneNumber)) {
        throw new InvalidError('phoneNumber', data.phoneNumber.toString(), "Must be required.")
    }
    if (!validator.isNumeric(data.phoneNumber)) {
        throw new InvalidError('phoneNumber', data.phoneNumber.toString(), "Must be numeric characters.")
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new InvalidError('status', data.status.toString(), "Not valid.")
        }
    }

    return true
}

function validate_update_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(PROFILE_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new UnknownInputError(unknownKeys)
    }
    if (typeof data.firstName !== "undefined" && !validator.isEmpty(data.firstName)) {
        if (!validator.isAlpha(data.firstName)) {
            throw new InvalidError('firstName', data.firstName.toString(), "Must be alphabetic characters.")
        }
        if (!validator.isLength(data.firstName, { min: 3, max: 30 })) {
            throw new InvalidError('firstName', data.firstName.toString(), "Must be from 3 to 30 characters.")
        }
    }
    if (typeof data.lastName !== "undefined" && !validator.isEmpty(data.lastName)) {
        if (!validator.isAlpha(data.lastName)) {
            throw new InvalidError('lastName', data.lastName.toString(), "Must be alphabetic characters.")
        }
        if (!validator.isLength(data.lastName, { min: 3, max: 30 })) {
            throw new InvalidError('lastName', data.lastName.toString(), "Must be from 3 to 30 characters.")
        }
    }
    if (typeof data.gender !== "undefined" && !validator.isEmpty(data.gender)) {
        if (!validator.isIn(data.gender, PROFILE_GENDER_VALUES)) {
            throw new InvalidError('gender', data.gender.toString(), "Only accepts [male, female, lgbt]")
        }
    }
    if (typeof data.dateOfBirth !== "undefined" && !validator.isEmpty(data.dateOfBirth)) {
        if (!validator.isDate(data.dateOfBirth)) {
            throw new InvalidError('dateOfBirth', data.dateOfBirth.toString(), "Must be in format [YYYY/MM/DD]")
        }
        if (!validator.isBefore(data.dateOfBirth, toFormatDateStr(new Date(new Date().getFullYear()-16,0,1)))) {
            throw new InvalidError('dateOfBirth', data.dateOfBirth.toString(), "Must be over 16 years old")
        }
    }
    if (typeof data.phoneNumber !== "undefined" && !validator.isEmpty(data.phoneNumber)) {
        if (!validator.isNumeric(data.phoneNumber)) {
            throw new InvalidError('phoneNumber', data.phoneNumber.toString(), "Must be numeric characters.")
        }
    }
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new InvalidError('status', data.status.toString(), "Not valid.")
        }
    }
    return true
}

module.exports = {validate_add_inp, validate_update_inp}