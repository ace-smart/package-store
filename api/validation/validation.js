const User = require("../models/UserModel")
const Category = require("../models/CategoryModel")
const { default: validator } = require("validator")

module.exports = validation = {
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

    // @desc    Find unknown keys from {req.body}
    // Args:    [ [validKeys], [reqBodyKeys] ]
    // Return:  Have errors => [unknownKeys]
    //          No errors => False
    hasUnknownKeys: ([...validKeys] = Array(), [...inputKeys]= Array()) => {
        // check null input
        if (!validKeys || !inputKeys) return Array()
        
        const unknownKeys = inputKeys.filter((ele) => {
            return !validKeys.includes(ele)
        })
        
        if (unknownKeys.length > 0) return unknownKeys
        return false
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

    // @desc    Check whether category name existent or not
    // Args:    [ name, categoryId ]
    // Return:  Existent => True
    //          Not existent => False
    isExistentCategoryName: async (name = null, categoryId = null) => {
        if (!name) return false

        try {
            const category = await Category.findOne({ name: name }).lean()

            if (!category) return false

            // Except 'userId'
            if (categoryId && category._id.toString() === categoryId.toString()) return false

            return true
        } catch (error) {
            return false
        }
    },

}
