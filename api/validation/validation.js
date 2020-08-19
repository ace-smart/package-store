const validator = require("validator")
const blacklistChars = new RegExp(
    "[\r\n\\t\\f\\v`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?\\-\\/\\.\\,:]+",
    "g"
)
module.exports = validation = {

    // @desc    Output error message
    // Args:    {error}
    // Return:  'Error message'
    outputErrors: (error) => {
        // Mongoose Errors
        if (typeof error.kind !== "undefined") {
            if (error.kind.toString() === "ObjectId") {
                return "Id is not valid"
            }
        }
        // Custom errors
        if (typeof error.message !== "undefined") {
            return error.message
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

        const unknownKeys = inputKeys.filter((ele) => {
            return !validKeys.includes(ele)
        })

        if (unknownKeys.length > 0) return unknownKeys
        return false
    },

    isExistent: async (model, criteria = {}, exceptionId = null) => {
        if (typeof model.findOne !== "undefined") {
            try {
                const object = await model.findOne(criteria).exec()
                if (!object) return false

                if (exceptionId && object._id.toString() === exceptionId.toString()) {
                    return false
                }

                return true
            } catch (error) {
                throw new Error(error)
            }
        }

        throw new Error("Can find object with the model.")
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
