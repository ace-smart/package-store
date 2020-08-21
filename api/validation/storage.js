const validator = require("validator")
const { hasUnknownKeys, isExistent, hasSpecialChars } = require("./validation")
const { STORAGE_FIELDS, STORAGE_STATUS_VALUES } = require("./_fields")
const { toCapitalize } = require("../helper/format")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(STORAGE_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // name [required]
    if (typeof data.name === "undefined" || validator.isEmpty(data.name)) {
        throw new Error("name is required.")
    }
    if (hasSpecialChars(data.name)) {
        throw new Error("name must contain only numbers,characters and spaces.")
    }
    if (!validator.isLength(data.name, { min: 4, max: 250 })) {
        throw new Error("name must be from 4 to 250 characters.")
    }
    if (
        await isExistent(require("../models/StorageModel"), {
            name: toCapitalize(validator.trim(data.name)),
        })
    ) {
        throw new Error("name is already existent.")
    }
    // addressId [required]
    if (typeof data.addressId === "undefined" || validator.isEmpty(data.addressId)) {
        throw new Error("addressId is required.")
    }
    if (!validator.isMongoId(data.addressId)) {
        throw new Error("addressId is in invalid format.")
    }
    if (!(await isExistent(require("../models/AddressModel"), { _id: data.addressId }))) {
        throw new Error("addressId is not existent.")
    }
    // propertyType
    if (typeof data.propertyType !== "undefined" && !validator.isEmpty(data.propertyType)) {
        if (!validator.isAlphanumeric(data.propertyType)) {
            throw new Error("propertyType must be numbers and letters")
        }
    }
    // capacity
    if (typeof data.capacity !== "undefined") {
        if (
            JSON.stringify(data.capacity) === "{}" ||
            typeof data.capacity === "string" ||
            data.capacity.size == null ||
            data.capacity.unit == null
        ) {
            throw new Error("capacity must contain two properties {size, unit}")
        }
        if (validator.isEmpty(data.capacity.size)) {
            throw new Error("capacity.size is required.")
        }
        if (!validator.isNumeric(data.capacity.size.toString())) {
            throw new Error("capacity.size must be numbers.")
        }
        if (!validator.isAlpha(data.capacity.unit.toString())) {
            throw new Error("capacity.unit must be letters.")
        }
        if (!validator.isLength(data.capacity.unit.toString(), { max: 5 })) {
            throw new Error("capacity.unit must be under 5 characters. (eg. kg, g )")
        }
    }
    // description
    if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
        if (hasSpecialChars(validator.trim(data.description))) {
            throw new Error("description can not be filled in with special characters")
        }
        if (!validator.isLength(validator.trim(data.description), { max: 350 })) {
            throw new Error("description must be under 350 characters.")
        }
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STORAGE_STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, storageId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(STORAGE_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // name [required]
    if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
        if (hasSpecialChars(data.name)) {
            throw new Error("name must contain only numbers,characters and spaces.")
        }
        if (!validator.isLength(data.name, { min: 4, max: 250 })) {
            throw new Error("name must be from 4 to 250 characters.")
        }
        if (
            await isExistent(require("../models/StorageModel"), {
                name: toCapitalize(validator.trim(data.name)),
            }, storageId)
        ) {
            throw new Error("name is already existent.")
        }
    }

    // addressId [required]
    if (typeof data.addressId !== "undefined" && !validator.isEmpty(data.addressId)) {
        if (!validator.isMongoId(data.addressId)) {
            throw new Error("addressId is in invalid format.")
        }
        if (!(await isExistent(require("../models/AddressModel"), { _id: data.addressId }))) {
            throw new Error("addressId is not existent.")
        }
    } 
    // propertyType
    if (typeof data.propertyType !== "undefined" && !validator.isEmpty(data.propertyType)) {
        if (!validator.isAlphanumeric(data.propertyType)) {
            throw new Error("propertyType must be numbers and letters")
        }
    }
    // capacity
    if (typeof data.capacity !== "undefined") {
        if (
            JSON.stringify(data.capacity) === "{}" ||
            typeof data.capacity === "string" ||
            data.capacity.size == null ||
            data.capacity.unit == null
        ) {
            throw new Error("capacity must contain two properties {size, unit}")
        }
        if (validator.isEmpty(data.capacity.size)) {
            throw new Error("capacity.size is required.")
        }
        if (!validator.isNumeric(data.capacity.size.toString())) {
            throw new Error("capacity.size must be numbers.")
        }
        if (!validator.isAlpha(data.capacity.unit.toString())) {
            throw new Error("capacity.unit must be letters.")
        }
        if (!validator.isLength(data.capacity.unit.toString(), { max: 5 })) {
            throw new Error("capacity.unit must be under 5 characters. (eg. kg, g )")
        }
    }
    // description
    if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
        if (hasSpecialChars(validator.trim(data.description))) {
            throw new Error("description can not be filled in with special characters")
        }
        if (!validator.isLength(validator.trim(data.description), { max: 350 })) {
            throw new Error("description must be under 350 characters.")
        }
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STORAGE_STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }

    return true
}

module.exports = { validate_add_inp, validate_update_inp }
