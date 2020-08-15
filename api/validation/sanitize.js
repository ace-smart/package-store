const validator = require("validator")
const bcrypt = require('bcrypt')
const { DEFAULT_VALUES } = require('./validation')
const { toCapitalize } = require('../helper/format')

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
    
    address: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.street !== "undefined" && !validator.isEmpty(data.street)) {
            objData.street = validator.escape(validator.trim(data.street))
        }
        if (typeof data.district !== "undefined" && !validator.isEmpty(data.district)) {
            objData.district = validator.trim(data.district.toLowerCase())
        } 
        if (typeof data.city !== "undefined" && !validator.isEmpty(data.city)) {
            objData.city = validator.trim(data.city.toLowerCase())
        } 
        if (typeof data.country !== "undefined" && !validator.isEmpty(data.country)) {
            objData.country = validator.trim(data.country.toLowerCase())
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
    
    product: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
            objData.name = toCapitalize(validator.trim(data.name.toLowerCase()))
        }
        if (typeof data.price !== "undefined" && JSON.stringify(data.price) !== '{}') {
            objData.price.value = parseFloat(data.price.value.toString())
            objData.price.currency = validator.trim(data.price.currency.toLowerCase()).toUpperCase()
        }
        if (typeof data.details !== "undefined" && JSON.stringify(data.details) !== '{}') {
            if (data.details.size != null){
                objData.details.size = validator.trim(data.details.size.toUpperCase())
            }
            if (data.details.color != null) {
                objData.details.color.name = toCapitalize(validator.trim(data.details.color.name.toLowerCase()))
            }
            if (data.details.tags != null){
                data.details.tags.forEach(element => {
                    objData.details.tags.push(toCapitalize(validator.trim(element.toLowerCase())))
                })
            }
            if (data.details.description != null){
                objData.details.description = toCapitalize(validator.trim(data.details.description))
            }
            if (data.details.madeIn != null){
                objData.details.madeIn = toCapitalize(validator.trim(data.details.madeIn.toLowerCase()))
            }
            if (data.details.weight != null){
                objData.details.weight.value = parseFloat(data.details.weight.value.toString())
                objData.details.weight.unit = validator.trim(data.details.weight.unit.toLowerCase())
            }
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
