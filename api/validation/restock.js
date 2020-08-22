const validator = require("validator")
const { hasUnknownKeys, isExistent, hasSpecialChars } = require("./validation")
const { RESTOCK_FIELDS, RESTOCK_ACTION_VALUES, STATUS_VALUES } = require("./_fields")
const { toCapitalize } = require("../helper/format")

async function validate_add_inp({ ...data } = {}) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(RESTOCK_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // productId [required]
    if (typeof data.productId === "undefined" || validator.isEmpty(data.productId)) {
        throw new Error("productId is required.")
    }
    if (!validator.isMongoId(data.productId)) {
        throw new Error("productId is in invalid format.")
    }
    if (!(await isExistent(require("../models/ProductModel"), { _id: data.productId }))) {
        throw new Error("productId is not existent.")
    }
    // action [required]
    if (typeof data.action === "undefined" || validator.isEmpty(data.action)) {
        throw new Error("action is required.")
    }
    if (hasSpecialChars(data.action)) {
        throw new Error("action must contain only numbers,characters and spaces.")
    }
    if (!validator.isIn(data.action.toLowerCase(), RESTOCK_ACTION_VALUES)) {
        throw new Error("action is not valid.")
    }
    if (typeof data.from === "undefined" || validator.isEmpty(data.from)) {
        throw new Error("from is required.")
    }
    if (typeof data.to === "undefined" || validator.isEmpty(data.to)) {
        throw new Error("to is required.")
    }
    if (!validator.isMongoId(data.from)) {
        throw new Error("from is in invalid format.")
    }
    if (!validator.isMongoId(data.to)) {
        throw new Error("to is in invalid format.")
    }
    // check ObjectId existent or not
    if (data.action.toLowerCase() === "import") {
        // import from Provider to Storage
        if (!(await isExistent(require("../models/ProviderModel"), { _id: data.from }))) {
            throw new Error("from is not existent")
        }
        if (!(await isExistent(require("../models/StorageModel"), { _id: data.to }))) {
            throw new Error("to is not existent")
        }
    } else if (data.action.toLowerCase() === "export") {
        // export from Storage to Customer (by Order)
        if (!(await isExistent(require("../models/StorageModel"), { _id: data.from }))) {
            throw new Error("from is not existent")
        }
        if (!(await isExistent(require("../models/OrderModel"), { _id: data.to }))) {
            throw new Error("to is not existent")
        }
    }

    // amount [required]
    if (typeof data.amount === "undefined" || validator.isEmpty(data.amount)) {
        throw new Error("amount is required.")
    }
    if (!validator.isNumeric(data.amount.toString())) {
        throw new Error("amount must be numbers.")
    }
    if (parseInt(data.amount.toString()) <= 0) {
        throw new Error("amount must be greater than 0.")
    }
    // status
    if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
        if (!validator.isIn(data.status.toLowerCase(), STATUS_VALUES)) {
            throw new Error("status is not valid.")
        }
    }

    return true
}

async function validate_update_inp({ ...data } = {}, restockId) {
    if (JSON.stringify(data) === "{}") {
        throw new Error("No input data")
    }
    const unknownKeys = hasUnknownKeys(RESTOCK_FIELDS, Object.keys(data))
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown input [${unknownKeys[0]}]`)
    }
    // productId [required]
    if (typeof data.productId === "undefined" || validator.isEmpty(data.productId)) {
        throw new Error("productId is required.")
    }
    if (!validator.isMongoId(data.productId)) {
        throw new Error("productId is in invalid format.")
    }
    if (!(await isExistent(require("../models/ProductModel"), { _id: data.productId }))) {
        throw new Error("productId is not existent.")
    }
    let restockAction = await require("../models/RestockModel").findOne({ _id: restockId }).lean().action
    // action
    if (typeof data.action !== "undefined" && !validator.isEmpty(data.action)) {
        if (hasSpecialChars(data.action)) {
            throw new Error("action can not have special characters.")
        }
        if (!validator.isIn(data.action.toLowerCase(), RESTOCK_ACTION_VALUES)) {
            throw new Error("action is not valid.")
        }
        // assign action from input
        restockAction = data.action.toLowerCase()
    }
    if (typeof data.from !== "undefined" && !validator.isEmpty(data.from)) {
        if (!validator.isMongoId(data.from)) {
            throw new Error("from is in invalid format.")
        }
    }
    if (typeof data.to !== "undefined" && !validator.isEmpty(data.to)) {
        if (!validator.isMongoId(data.to)) {
            throw new Error("to is in invalid format.")
        }
    }
    // check ObjectId existent or not
    if (restockAction === "import") {
        // import from Provider to Storage
        if (data.from.toString() != null) {
            if (!(await isExistent(require("../models/ProviderModel"), { _id: data.from }))) {
                throw new Error("from is not existent")
            }
        }
        if (data.to.toString() != null) {
            if (!(await isExistent(require("../models/StorageModel"), { _id: data.to }))) {
                throw new Error("to is not existent")
            }
        }
    } else if (restockAction === "export") {
        // export from Storage to Customer (by Order)
        if (data.from.toString() != null) {
            if (!(await isExistent(require("../models/StorageModel"), { _id: data.from }))) {
                throw new Error("from is not existent")
            }
        }
        if (data.to.toString() != null) {
            if (!(await isExistent(require("../models/OrderModel"), { _id: data.to }))) {
                throw new Error("to is not existent")
            }
        }
    }
    // amount
    if (typeof data.amount !== "undefined" && !validator.isEmpty(data.amount)) {
        if (!validator.isNumeric(data.amount.toString())) {
            throw new Error("amount must be numbers.")
        }
        if (parseInt(data.amount.toString()) <= 0) {
            throw new Error("amount must be greater than 0.")
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
