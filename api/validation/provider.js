const validator = require("validator")
const {hasUnknownKeys,isExistent,hasSpecialChars} = require("./validation")
const { PROVIDER_FIELDS, STATUS_VALUES, } = require("./_fields")
const { toCapitalize } = require("../helper/format")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(PROVIDER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
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
    // name [required]
    if (typeof data.name === "undefined" || validator.isEmpty(data.name)) {
        throw new Error("name is required.")
    }
    if (hasSpecialChars(data.name)) {
        throw new Error("name must contain only numbers,characters and spaces.")
    }
    if (!validator.isLength(data.name, { min: 4, max: 255 })) {
        throw new Error("name must be from 4 to 255 characters.")
    }
    if (
        await isExistent(require("../models/ProviderModel"), {
            name: toCapitalize(validator.trim(data.name)),
        })
    ) {
        throw new Error("name is already existent.")
    }
    // email [required]
    if (typeof data.email === "undefined" || validator.isEmpty(data.email)) {
        throw new Error("email is required.")
    }
    if (!validator.isEmail(data.email)) {
        throw new Error("email is not valid.")
    }
    if (!validator.isLength(data.email, { max: 255 })) {
        throw new Error("email must be less than 255 characters.")
    }
    if (await isExistent(require("../models/ProviderModel"), { email: data.email.toLowerCase() })) {
        throw new Error("email is already existent.")
    }
    // description
    if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
        if (hasSpecialChars(data.description)) {
            throw new Error("description can not be filled in with special characters")
        }
        if (!validator.isLength(data.description, { max: 300 })) {
            throw new Error("description must be under 300 characters.")
        }
    }
    // country
    if (typeof data.country !== "undefined" && !validator.isEmpty(data.country)) {
        if (hasSpecialChars(data.country)) {
            throw new Error("country must contain only numbers,characters and spaces.")
        }
        if (!validator.isLength(data.country, { max: 200 })) {
            throw new Error("country must be under 200 characters.")
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

async function validate_update_inp({ ...data } = {}, productId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(PROVIDER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
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
    // name [required]
    if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
        if (hasSpecialChars(data.name)) {
            throw new Error("name must contain only numbers,characters and spaces.")
        }
        if (!validator.isLength(data.name, { min: 4, max: 255 })) {
            throw new Error("name must be from 4 to 255 characters.")
        }
        if (
            await isExistent(require("../models/ProviderModel"), {
                name: toCapitalize(validator.trim(data.name)),
            }, productId)
        ) {
            throw new Error("name is already existent.")
        }
    }
    // email [required]
    if (typeof data.email !== "undefined" && !validator.isEmpty(data.email)) {
        if (!validator.isEmail(data.email)) {
            throw new Error("email is not valid.")
        }
        if (!validator.isLength(data.email, { max: 255 })) {
            throw new Error("email must be less than 255 characters.")
        }
        if (
            await isExistent(require("../models/ProviderModel"), {
                email: data.email.toLowerCase(),
            }, productId)
        ) {
            throw new Error("email is already existent.")
        }
    }
    // description
    if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
        if (hasSpecialChars(data.description)) {
            throw new Error("description can not be filled in with special characters")
        }
        if (!validator.isLength(data.description, { max: 300 })) {
            throw new Error("description must be under 300 characters.")
        }
    }
    // country
    if (typeof data.country !== "undefined" && !validator.isEmpty(data.country)) {
        if (hasSpecialChars(data.description)) {
            throw new Error("country must contain only numbers,characters and spaces.")
        }
        if (!validator.isLength(data.country, { max: 200 })) {
            throw new Error("country must be under 200 characters.")
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
