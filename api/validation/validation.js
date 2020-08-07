const User = require("../models/UserModel")

module.exports = {
    // @desc    Get errors if it existed
    // Args:    { field1: [errorArray], field2: [errorArray], ... }
    // Return:  Have errors => { field: [errors], ... }
    //          No errors => False
    hasError: ({ ...result } = {}) => {
        // check null input
        if (JSON.stringify(result) === "{}") return false

        const keys = Object.keys(result)
        const values = Object.values(result)

        let errors = {}
        for (let i = 0; i < keys.length; i++) {
            // check errors existed
            if (values[i].length > 0) {
                errors[keys[i]] = values[i]
            }
        }

        if (JSON.stringify(errors) === "{}") return false
        return errors
    },

    // @desc    Check whether email existent or not
    // Args:    [ email, userId ]
    // Return:  Existent => True
    //          Not existent => False
    isExistentEmail: async (email = null, userId = null) => {
        if (!email) return false

        try {
            const user = await User.findOne({ email: email }).lean()

            if (!user) return false

            // Except 'userId'
            if (userId && user._id.toString() === userId.toString()) return false
            return true
        } catch (error) {
            return false
        }
    },

    // @desc    Check whether username existent or not
    // Args:    [ username, userId ]
    // Return:  Existent => True
    //          Not existent => False
    isExistentUsername: async (username = null, userId = null) => {
        if (!username) return false

        try {
            const user = await User.findOne({ username: username }).lean()

            if (!user) return false

            // Except 'userId'
            if (userId && user._id.toString() === userId.toString()) return false

            return true
        } catch (error) {
            return false
        }
    },

}
