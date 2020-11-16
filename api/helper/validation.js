const validator = require("validator")
const blacklistChars = new RegExp(
    "[\r\n\\t\\f\\v`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?\\-\\/\\.\\,:]+",
    "g"
)

module.exports = validation = {
    STATUS_VALUES: ["activated", "deactivated"],

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
        }

        return false
    },
    
}
