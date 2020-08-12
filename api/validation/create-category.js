const validator = require('validator')
const { hasUnknownKeys, isExistent,CATEGORY_FIELDS, STATUS_VALUES } = require("./validation")

module.exports = async function validate({ ...data } = {}) {
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

