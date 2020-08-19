const validator = require("validator")
const { hasUnknownKeys } = require("./validation")
const {  ADDRESS_FIELDS, STATUS_VALUES } = require("./_fields")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(ADDRESS_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // street [required]
    if (typeof data.street === "undefined" || validator.isEmpty(data.street)) {
        throw new Error("street is required.")
    }
    if (
        validator.matches(
            data.street,
            new RegExp("[\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?]+", "g")
        )
    ) {
        throw new Error("street is only allowed to have these special characters [\\/-,.:]")
    }
    if (!validator.matches(data.street, RegExp("[\\w/-/\\.\\,:]+", "g"))) {
        throw new Error("street must contain only numbers, characters and [\\/-,.:].")
    }
    if (!validator.isLength(data.street, { max: 350 })) {
        throw new Error("street must be under 350 characters.")
    }
    // district [required]
    if (typeof data.district === "undefined" || validator.isEmpty(data.district)) {
        throw new Error("district is required.")
    }
    if (!validator.isAlphanumeric(data.district)) {
        throw new Error("district must contain only numbers and characters.")
    }
    if (!validator.isLength(data.district, { max: 255 })) {
        throw new Error("district must be  under 255 characters.")
    }
    // city [required]
    if (typeof data.city === "undefined" || validator.isEmpty(data.city)) {
        throw new Error("city is required.")
    }
    if (!validator.isAlphanumeric(data.city)) {
        throw new Error("city must contain only numbers and characters.")
    }
    if (!validator.isLength(data.city, { max: 300 })) {
        throw new Error("city must be under 255 characters.")
    }
    // country [required]
    if (typeof data.country === "undefined" || validator.isEmpty(data.country)) {
        throw new Error("country is required.")
    }
    if (!validator.isAlpha(data.country)) {
        throw new Error("country must contain only alphabetic characters.")
    }
    if (!validator.isLength(data.country, { max: 255 })) {
        throw new Error("country must be under 255 characters.")
    }
    // postalCode [required]
    if (typeof data.postalCode === "undefined" || validator.isEmpty(data.postalCode)) {
        throw new Error("postalCode is required.")
    }
    if (!validator.isNumeric(data.postalCode, {no_symbols: true})) {
        throw new Error("postalCode must be only numbers")
    }
    if (!validator.isLength(data.postalCode, { max: 10 })) {
        throw new Error("postalCode must be under 10 characters.")
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
    const unknownKeys = hasUnknownKeys(ADDRESS_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    if (typeof data.street !== "undefined" && !validator.isEmpty(data.street)) {
        if (
            validator.matches(
                data.street,
                new RegExp("[\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?]+", "g")
            )
        ) {
            throw new Error("street is only allowed to have these special characters [\\/-,.:]")
        }
        if (!validator.matches(data.street, RegExp("[\\w/-/\\.\\,:]+", "g"))) {
            throw new Error("street must contain only numbers, characters and [\\/-,.:].")
        }
        if (!validator.isLength(data.street, { max: 350 })) {
            throw new Error("street must be under 350 characters.")
        }
    }
    if (typeof data.district !== "undefined" && !validator.isEmpty(data.district)) {
        if (!validator.isAlphanumeric(data.district)) {
            throw new Error("district must contain only numbers and characters.")
        }
        if (!validator.isLength(data.district, { max: 255 })) {
            throw new Error("district must be  under 255 characters.")
        }
    }
    if (typeof data.city !== "undefined" && !validator.isEmpty(data.city)) {
        if (!validator.isAlphanumeric(data.city)) {
            throw new Error("city must contain only numbers and characters.")
        }
        if (!validator.isLength(data.city, { max: 300 })) {
            throw new Error("city must be under 255 characters.")
        }
    }
    if (typeof data.country !== "undefined" && !validator.isEmpty(data.country)) {
        if (!validator.isAlpha(data.country)) {
            throw new Error("country must contain only alphabetic characters.")
        }
        if (!validator.isLength(data.country, { max: 255 })) {
            throw new Error("country must be under 255 characters.")
        }
    }
    if (typeof data.postalCode !== "undefined" && !validator.isEmpty(data.postalCode)) {
        if (!validator.isNumeric(data.postalCode, {no_symbols: true})) {
            throw new Error("postalCode must be only numbers")
        }
        if (!validator.isLength(data.postalCode, { max: 10})) {
            throw new Error("postalCode must be under 10 characters.")
        }
    }
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }
    return true
}

module.exports = { validate_add_inp, validate_update_inp }
