const validator = require("validator")
const { hasUnknownKeys, isExistent } = require("./validation")
const { USER_FIELDS,  USER_ROLE, STATUS_VALUES } = require("./_fields")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(USER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // email [required]
    if (typeof data.email === "undefined" || validator.isEmpty(data.email)) {
        throw new Error("email is required.")
    }
    if (!validator.isEmail(data.email)) {
        throw new Error("email is not valid.")
    }
    if (!validator.isLength(data.email, { max: 255 })) {
        throw new Error("email must be less than 256 characters.")
    }
    if (await isExistent(require("../models/UserModel"), { email: data.email })) {
        throw new Error("email is already existent.")
    }
    // username [required]
    if (typeof data.username === "undefined" || validator.isEmpty(data.username)) {
        throw new Error("username is required.")
    }
    if (!validator.isAlphanumeric(data.username)) {
        throw new Error("username must contain only numbers and characters.")
    }
    if (!validator.isLength(data.username, { min: 4, max: 255 })) {
        throw new Error("username must be from 4 to 255 characters.")
    }
    if (await isExistent(require("../models/UserModel"), { username: data.username })) {
        throw new Error("username is already existent.")
    }
    // password [required]
    if (typeof data.password === "undefined" || validator.isEmpty(data.password)) {
        throw new Error("Password is required.")
    }
    if (!validator.isLength(data.password, { min: 4, max: 255 })) {
        throw new Error("Password must be from 4 to 255 characters.")
    }
    // role
    if (typeof data.role !== "undefined" && !validator.isEmpty(data.role)) {
        if (!validator.isIn(data.role.toLowerCase(), USER_ROLE)) {
            throw new Error("role is not valid.")
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

async function validate_update_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(USER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // email
    if (typeof data.email !== "undefined" && !validator.isEmpty(data.email)) {
        if (!validator.isEmail(data.email)) {
            throw new Error("email is not valid.")
        }
        if (!validator.isLength(data.email, { max: 255 })) {
            throw new Error("email must be less than 256 characters.")
        }
        if (await isExistent(require("../models/UserModel"), { email: data.email })) {
            throw new Error("email is already existent.")
        }
    }
    // username
    if (typeof data.username !== "undefined" && !validator.isEmpty(data.username)) {
        if (!validator.isAlphanumeric(data.username)) {
            throw new Error("username must contain only numbers and characters.")
        }
        if (!validator.isLength(data.username, { min: 4, max: 255 })) {
            throw new Error("username must be from 4 to 255 characters.")
        }
        if (await isExistent(require("../models/UserModel"), { username: data.username })) {
            throw new Error("username is already existent.")
        }
    }
    // password
    if (typeof data.password !== "undefined" && !validator.isEmpty(data.password)) {
        if (!validator.isLength(data.password, { min: 4, max: 255 })) {
            throw new Error("Password must be from 4 to 255 characters.")
        }
    }
    // role
    if (typeof data.role !== "undefined" && !validator.isEmpty(data.role)) {
        if (!validator.isIn(data.role.toLowerCase(), USER_ROLE)) {
            throw new Error("role is not valid.")
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
