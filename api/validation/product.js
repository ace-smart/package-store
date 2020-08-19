const validator = require("validator")
const { hasUnknownKeys, isExistent } = require("./validation")
const { PRODUCT_FIELDS, STATUS_VALUES } = require("./_fields")
const { toCapitalize } = require("../helper/format")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(PRODUCT_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // categoryId [required]
    if (typeof data.categoryId === "undefined" || validator.isEmpty(data.categoryId)) {
        throw new Error("categoryId is required.")
    }
    if (!validator.isMongoId(data.categoryId)) {
        throw new Error("categoryId is in invalid format.")
    }
    if (!(await isExistent(require("../models/CategoryModel"), { _id: data.categoryId }))) {
        throw new Error("categoryId is not existent.")
    }
    // name [required]
    if (typeof data.name === "undefined" || validator.isEmpty(data.name)) {
        throw new Error("name is required.")
    }
    if (
        validator.matches(
            data.name,
            new RegExp("[\r\n\t\f\v\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?\\-\\/\\.\\,:]+", "g")
        )
    ) {
        throw new Error("name must contain only numbers,characters and spaces.")
    }
    if (!validator.matches(validator.trim(data.name), RegExp("(\\w+ \\w+)+", "g"))) {
        throw new Error("name must contain only numbers and characters.")
    }
    if (!validator.isLength(data.name, { min: 4, max: 200 })) {
        throw new Error("name must be from 4 to 200 characters.")
    }
    if (
        await isExistent(require("../models/ProductModel"), {
            name: toCapitalize(validator.trim(data.name.toLowerCase())),
        })
    ) {
        throw new Error("name is already existent.")
    }
    // price [required]
    if (typeof data.price === "undefined") {
        throw new Error("price is required.")
    }
    if (
        JSON.stringify(data.price) === "{}" ||
        typeof data.price === "string" ||
        data.price.value == null ||
        data.price.currency == null
    ) {
        throw new Error("price must contain two properties {value, currency}")
    }
    if (!validator.isNumeric(data.price.value.toString())) {
        throw new Error("price.value must be numbers")
    }
    if (!validator.isAlpha(data.price.currency)) {
        throw new Error(
            "price.currency must contain only alphabetic characters. (eg. USD, AUS, CAD)"
        )
    }
    if (!validator.isLength(data.price.currency, { max: 6 })) {
        throw new Error("price.currency must be under 6 characters.")
    }
    // details
    if (typeof data.details !== "undefined" && !JSON.stringify(data.details) !== "{}") {
        if (data.details.size != null) {
            if (!validator.isAlphanumeric(data.details.size)) {
                throw new Error("details.size must be only numbers and characters")
            }
        }
        if (data.details.color != null) {
            if (
                JSON.stringify(data.details.color) === "{}" ||
                data.details.color.name == null ||
                data.details.color.hexCode == null
            ) {
                throw new Error("details.color must have two properties {name, hexCode}")
            }
            if (!validator.isAlphanumeric(data.details.color.name)) {
                throw new Error("details.color.name must be only numbers and characters")
            }
            if (!validator.isHexColor(data.details.color.hexCode)) {
                throw new Error("details.color.hexCode is invalid.")
            }
        }
        if (data.details.tags != null) {
            if (!Array.isArray(data.details.tags)) {
                throw new Error("details.tags must be an array of strings")
            }
            if (data.details.tags.length > 0) {
                const invalidElements = data.details.tags.find(
                    (ele) => !validator.isAlphanumeric(ele)
                )
                if (invalidElements) {
                    throw new Error(
                        "details.tags must only have elements which are numbers and characters"
                    )
                }
            }
        }
        if (data.details.description != null) {
            if (!validator.isAlphanumeric(data.details.description)) {
                throw new Error("details.description must be only numbers and characters")
            }
        }
        if (data.details.madeIn != null) {
            if (!validator.isAlphanumeric(data.details.madeIn)) {
                throw new Error("details.madeIn must be only numbers and characters")
            }
        }
        if (data.details.weight != null) {
            if (
                JSON.stringify(data.details.weight) === "{}" ||
                data.details.weight.value == null ||
                data.details.weight.unit == null
            ) {
                throw new Error("details.weight must contain two properties {value, unit}")
            }
            if (!validator.isNumeric(data.details.weight.value.toString())) {
                throw new Error("details.weight.value must be only numbers")
            }
            if (!validator.isAlpha(data.details.weight.unit)) {
                throw new Error("details.weight.unit must be only alphabetic characters (eg. Kg, g, lbs)")
            }
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
    const unknownKeys = hasUnknownKeys(PRODUCT_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // categoryId
    if (typeof data.categoryId !== "undefined" && !validator.isEmpty(data.categoryId)) {
        if (!validator.isMongoId(data.categoryId)) {
            throw new Error("categoryId is in invalid format.")
        }
        if (!(await isExistent(require("../models/CategoryModel"), { _id: data.categoryId }))) {
            throw new Error("categoryId is not existent.")
        }
    }
    // name
    if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
        if (
            validator.matches(
                data.name,
                new RegExp("[\r\n\t\f\v\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?\\-\\/\\.\\,:]+", "g")
            )
        ) {
            throw new Error("name must contain only numbers,characters and spaces.")
        }
        if (!validator.matches(validator.trim(data.name), RegExp("(\\w+ \\w+)+", "g"))) {
            throw new Error("name must contain only numbers and characters.")
        }
        if (!validator.isLength(data.name, { min: 4, max: 200 })) {
            throw new Error("name must be from 4 to 200 characters.")
        }
        if (
            await isExistent(require("../models/ProductModel"), {
                name: toCapitalize(validator.trim(data.name.toLowerCase())),
            })
        ) {
            throw new Error("name is already existent.")
        }
    }
    // price
    if (typeof data.price !== "undefined") {
        if (
            JSON.stringify(data.price) === "{}" ||
            typeof data.price === "string" ||
            data.price.value == null ||
            data.price.currency == null
        ) {
            throw new Error("price must contain two properties {value, currency}")
        }
        if (!validator.isNumeric(data.price.value.toString())) {
            throw new Error("price.value must be numbers")
        }
        if (!validator.isAlpha(data.price.currency)) {
            throw new Error(
                "price.currency must contain only alphabetic characters. (eg. USD, AUS, CAD)"
            )
        }
        if (!validator.isLength(data.price.currency, { max: 6 })) {
            throw new Error("price.currency must be under 6 characters.")
        }
    }
    // details
    if (typeof data.details !== "undefined" && !JSON.stringify(data.details) !== "{}") {
        if (data.details.size != null) {
            if (!validator.isAlphanumeric(data.details.size)) {
                throw new Error("details.size must be only numbers and characters")
            }
        }
        if (data.details.color != null) {
            if (
                JSON.stringify(data.details.color) === "{}" ||
                data.details.color.name == null ||
                data.details.color.hexCode == null
            ) {
                throw new Error("details.color must have two properties {name, hexCode}")
            }
            if (!validator.isAlphanumeric(data.details.color.name)) {
                throw new Error("details.color.name must be only numbers and characters")
            }
            if (!validator.isHexColor(data.details.color.hexCode)) {
                throw new Error("details.color.hexCode is invalid.")
            }
        }
        if (data.details.tags != null) {
            if (!Array.isArray(data.details.tags)) {
                throw new Error("details.tags must be an array of strings")
            }
            if (data.details.tags.length > 0) {
                const invalidElements = data.details.tags.find(
                    (ele) => !validator.isAlphanumeric(ele)
                )
                if (invalidElements) {
                    throw new Error(
                        "details.tags must only have elements which are numbers and characters"
                    )
                }
            }
        }
        if (data.details.description != null) {
            if (!validator.isAlphanumeric(data.details.description)) {
                throw new Error("details.description must be only numbers and characters")
            }
        }
        if (data.details.madeIn != null) {
            if (!validator.isAlphanumeric(data.details.madeIn)) {
                throw new Error("details.madeIn must be only numbers and characters")
            }
        }
        if (data.details.weight != null) {
            if (
                JSON.stringify(data.details.weight) === "{}" ||
                data.details.weight.value == null ||
                data.details.weight.unit == null
            ) {
                throw new Error("details.weight must contain two properties {value, unit}")
            }
            if (!validator.isNumeric(data.details.weight.value.toString())) {
                throw new Error("details.weight.value must be only numbers")
            }
            if (!validator.isAlpha(data.details.weight.unit)) {
                throw new Error("details.weight.unit must be only alphabetic characters (eg. Kg, g, lbs)")
            }
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
