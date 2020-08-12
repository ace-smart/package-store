const User = require("../models/UserModel")
// Model constants
const DEFAULT_VALUES = {
    user: {role: "user", status: "deactivated"},
    status: "deactivated"
}
const STATUS_VALUES = ["activated", "deactivated"]
const USER_ROLE = ["user", "admin"]
const USER_FIELDS = ['username','password','email','status','role']
const PROFILE_FIELDS = ["firstName", "lastName", "gender", "dateOfBirth", "phoneNumber", "status"]
const PROFILE_GENDER_VALUES = ["male", "female", "lgbt"]
const CATEGORY_FIELDS = ['name','status','subcategories']

module.exports = validation = {
    DEFAULT_VALUES: DEFAULT_VALUES,
    STATUS_VALUES: STATUS_VALUES,
    USER_ROLE: USER_ROLE,
    USER_FIELDS: USER_FIELDS,
    PROFILE_FIELDS: PROFILE_FIELDS,
    PROFILE_GENDER_VALUES: PROFILE_GENDER_VALUES,
    CATEGORY_FIELDS: CATEGORY_FIELDS,
    
    // @desc    Output error message
    // Args:    {error}
    // Return:  'Error message'
    outputErrors: (error) => {
        // Mongoose Errors
        if (typeof error.kind !== 'undefined'){
            if (error.kind.toString() === 'ObjectId') {
                return 'Id is not valid'
            }
        }
        // Custom errors
        if (typeof error.message !== 'undefined') {
            return error.message
        }
        

        return null
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

    isExistent: async (model, criteria = {}, exceptionId = null) => {
        if (typeof model.findOne !== 'undefined') {
            try {
                const object =  await model.findOne(criteria).exec()
                if (!object) return false

                if (exceptionId && object._id.toString() === exceptionId.toString()) {
                    return false
                }

                return true
            } catch (error) {
                throw new Error(error)
            }
        }
        
        throw new Error('Can find object with the model.')
    }

}
