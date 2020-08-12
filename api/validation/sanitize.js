const validator = require("validator")
const bcrypt = require('bcrypt')
const { DEFAULT_VALUES } = require('./validation')

module.exports = {
    user: async ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.username !== "undefined" && !validator.isEmpty(data.username)) {
            objData.username = validator.trim(data.username.toLowerCase())
        }
        if (typeof data.email !== "undefined" && !validator.isEmpty(data.email)) {
            objData.email = validator.trim(data.email.toLowerCase())
        }
        if (typeof data.role !== "undefined" && !validator.isEmpty(data.role)) {
            objData.role = validator.trim(data.role.toLowerCase())
        } 
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        }
        if (typeof data.password !== "undefined" && !validator.isEmpty(data.password)) {
            objData.password = await bcrypt.hash(data.password,await bcrypt.genSalt())
        }
        // Set default values
        if (crudOption === 'create') {
            if (typeof data.role === "undefined" || validator.isEmpty(data.role)) {
                objData.role = DEFAULT_VALUES.user.role
            } 
            if (typeof data.status === "undefined" || validator.isEmpty(data.status)) {
                objData.status = DEFAULT_VALUES.user.status
            }
        }
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }

        return objData
    },

    profile: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.firstName !== "undefined" && !validator.isEmpty(data.firstName)) {
            objData.firstName = validator.trim(data.firstName.toLowerCase())
        }
        if (typeof data.lastName !== "undefined" && !validator.isEmpty(data.lastName)) {
            objData.lastName = validator.trim(data.lastName.toLowerCase())
        }
        if (typeof data.gender !== "undefined" && !validator.isEmpty(data.gender)) {
            objData.gender = validator.trim(data.gender.toLowerCase())
        }
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        }
        // Set default values
        if (crudOption === 'create') {
            if (typeof data.status === "undefined" || validator.isEmpty(data.status)) {
                objData.status = DEFAULT_VALUES.status
            }
        }
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }

        return objData
    },

    category: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
            objData.name = validator.trim(data.name.toLowerCase())
        }
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        } 

        // Set default values
        if (crudOption === 'create') {
            if (typeof data.status === "undefined" || validator.isEmpty(data.status)) {
                objData.status = DEFAULT_VALUES.status
            }
        }
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }
        
        return objData
    },
}
