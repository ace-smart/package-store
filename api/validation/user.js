const validator = require("validator")
const { hasUnknownKeys, isExistent } = require("./validation")
const { USER_FIELDS,  USER_ROLE, STATUS_VALUES } = require("./_fields")
const {UnknownInputError, InvalidError} = require('./error')

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(USER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new UnknownInputError(unknownKeys)
    }
    // email [required]
    if (typeof data.email === "undefined" || validator.isEmpty(data.email)) {
        throw new InvalidError('email', data.email.toString(), "Must be required.")
    }
    if (!validator.isEmail(data.email)) {
        throw new InvalidError('email', data.email.toString(), "Email is not valid.")
    }
    if (!validator.isLength(data.email, { max: 255 })) {
        throw new InvalidError('email', data.email.toString(), "Must be less than 256 characters.")
    }
    if (await isExistent(require("../models/UserModel"), { email: data.email })) {
        throw new InvalidError('email', data.email.toString(), "Email is already existent.")
    }
    // username [required]
    if (typeof data.username === "undefined" || validator.isEmpty(data.username)) {
        throw new InvalidError('username', data.username.toString(), "Must be required.")
    }
    if (!validator.isAlphanumeric(data.username)) {
        throw new InvalidError('username', data.username.toString(), "Must be only numbers and characters.")
    }
    if (!validator.isLength(data.username, { min: 4, max: 255 })) {
        throw new InvalidError('username', data.username.toString(), "Must be from 4 to 255 characters.")
    }
    if (await isExistent(require("../models/UserModel"), { username: data.username })) {
        throw new InvalidError('username', data.username.toString(), "Username is already existent.")
    }
    // password [required]
    if (typeof data.password === "undefined" || validator.isEmpty(data.password)) {
        throw new InvalidError('password', data.password.toString(), "Must be required.")
    }
    if (!validator.isLength(data.password, { min: 4, max: 255 })) {
        throw new InvalidError('password', data.password.toString(), "Must be from 4 to 255 characters.")
    }
    // role
    if (typeof data.role !== "undefined" && !validator.isEmpty(data.role)) {
        if (!validator.isIn(data.role.toLowerCase(), USER_ROLE)) {
            throw new InvalidError('role', data.role.toString(), "Role is not valid.")
        }
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new InvalidError('status', data.status.toString(), "Status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, userId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(USER_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new UnknownInputError(unknownKeys)
    }
    // email
    if (typeof data.email !== "undefined" && !validator.isEmpty(data.email)) {
        if (!validator.isEmail(data.email)) {
            throw new InvalidError('email', data.email.toString(), "Email is not valid.")
        }
        if (!validator.isLength(data.email, { max: 255 })) {
            throw new InvalidError('email', data.email.toString(), "Must be less than 256 characters.")
        }
        if (await isExistent(require("../models/UserModel"), { email: data.email }, userId)) {
            throw new InvalidError('email', data.email.toString(), "This email is already existent.")
        }
    }
    // username
    if (typeof data.username !== "undefined" && !validator.isEmpty(data.username)) {
        if (!validator.isAlphanumeric(data.username)) {
            throw new InvalidError('username', data.username.toString(), "Must be only numbers and characters.")
        }
        if (!validator.isLength(data.username, { min: 4, max: 255 })) {
            throw new InvalidError('username', data.username.toString(), "Must be from 4 to 255 characters.")
        }
        if (await isExistent(require("../models/UserModel"), { username: data.username }, userId)) {
            throw new InvalidError('username', data.username.toString(), "This username is already existent.")
        }
    }
    // password
    if (typeof data.password !== "undefined" && !validator.isEmpty(data.password)) {
        if (!validator.isLength(data.password, { min: 4, max: 255 })) {
            throw new InvalidError('password', data.password.toString(), "Must be from 4 to 255 characters.")
        }
    }
    // role
    if (typeof data.role !== "undefined" && !validator.isEmpty(data.role)) {
        if (!validator.isIn(data.role.toLowerCase(), USER_ROLE)) {
            throw new InvalidError('role', data.role.toString(), "Role is not valid.")
        }
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new InvalidError('status', data.status.toString(), "Status is not valid.")
        }
    }

    return true
}

module.exports = { validate_add_inp, validate_update_inp }
