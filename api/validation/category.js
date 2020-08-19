const validator = require('validator')
const { hasUnknownKeys, isExistent  } = require("./validation")
const {  CATEGORY_FIELDS, STATUS_VALUES } = require("./_fields")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(CATEGORY_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // name [required]
    if (typeof data.name === 'undefined' || validator.isEmpty(data.name)){
        throw new Error('Name is required.')
    }
    if (!validator.isAlphanumeric(data.name)){
        throw new Error('Name must contain only numbers and characters.')
    }
    if (!validator.isLength(data.name, {min: 4, max: 40})){
        throw new Error('Name must be from 4 to 40 characters.')
    }
    if (await isExistent(require('../models/CategoryModel'), {name: data.name})) {
        throw new Error('name is already existent.')
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("Status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, categoryId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(CATEGORY_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
        if (!validator.isAlphanumeric(data.name)){
            throw new Error('Name must contain only numbers and characters.')
        }
        if (!validator.isLength(data.name, { min: 4, max: 50 })) {
            throw new Error("name must be from 4 to 50 characters.")
        }
        if (await isExistent(require('../models/CategoryModel'), {name: data.name}, categoryId)) {
            throw new Error('name is already existent.')
        }
    }
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }
    return true
}

module.exports = {validate_add_inp, validate_update_inp}