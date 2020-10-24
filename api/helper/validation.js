const validator = require("validator")
const blacklistChars = new RegExp(
    "[\r\n\\t\\f\\v`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?\\-\\/\\.\\,:]+",
    "g"
)
const {InvalidError, UnknownInputError} = require('../validation/error')
module.exports = validation = {

    // @desc    Output error message
    // Args:    {error}
    // Return:  'Error message'
    outputErrors: (error) => {
        // InvalidError
        if (error instanceof InvalidError || error instanceof UnknownInputError){
            return {...error}
        }
        
        // Mongoose Errors
        if (typeof error.kind !== "undefined") {
            if (error.kind.toString() === "ObjectId") {
                return {message: "Id is not valid"}
            }
        }
        // ObjectId from URL is not existent for [Update]
        if (error.message === "Cannot read property '_id' of null"){
            return {message: 'The param for [Id] from Url is not existent.'}
        }

        // Custom errors
        if (typeof error.message !== "undefined") {
            return {message: error.message}
        }

        return null
    },

    // @desc    Find unknown keys from {req.body}
    // Args:    [ [validKeys], [reqBodyKeys] ]
    // Return:  Have errors => [unknownKeys]
    //          No errors => False
    hasUnknownKeys: ([...validKeys] = Array(), [...inputKeys] = Array()) => {
        // check null input
        if (!validKeys || !inputKeys) return Array()

        return inputKeys.filter((ele) => {
            return !validKeys.includes(ele)
        })

    },

    isExistent: async (model, criteria = {}, exceptionId = null) => {
        if (typeof model.findOne !== "undefined") {
            try {
                const object = await model.findOne(criteria).lean()
                if (!object) return false

                if (exceptionId && object._id.toString() === exceptionId.toString()) {
                    return false
                }

                return true
            } catch (error) {
                throw new Error(error)
            }
        }

        throw new Error("Can not find object with the model.")
    },

    hasSpecialChars: (string = null) => {
        if (string) {
            if (validator.matches(validator.trim(string), blacklistChars)) {
                return true
            }
            if (!validator.matches(validator.trim(string), RegExp("(\\w+|\\w+ \\w+)+", "g"))) {
                return true
            }

            return false
        }

        return false
    },
}
