const validator = require("validator")
const bcrypt = require('bcrypt')
const { DEFAULT_VALUES } = require('./_fields')
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
            objData.firstName = toCapitalize(validator.trim(data.firstName))
        }
        if (typeof data.lastName !== "undefined" && !validator.isEmpty(data.lastName)) {
            objData.lastName = toCapitalize(validator.trim(data.lastName))
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

    provider: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
            objData.name = toCapitalize(validator.trim(data.name))
        }
        if (typeof data.email !== "undefined" && !validator.isEmpty(data.email)) {
            objData.email = validator.trim(data.email.toLowerCase())
        } 
        if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
            objData.description = validator.trim(data.description)
        }

        if (typeof data.country !== "undefined" && !validator.isEmpty(data.country)) {
            objData.country = toCapitalize(validator.trim(data.country))
        }
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        } 

        // Set default values
        if (crudOption === 'create') {
            if (typeof data.status === "undefined" || validator.isEmpty(data.status)) {
                objData.status = DEFAULT_VALUES.status
            }
            if (data.description != null){
                objData.description = null
            }
            if (data.country != null){
                objData.country = null
            }
        }
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }
        
        return objData
    },

    voucher: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
            objData.name = toCapitalize(validator.trim(data.name))
        }
        if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
            objData.description = toCapitalize(validator.trim(data.description))
        } 
        if (typeof data.code !== "undefined" && !validator.isEmpty(data.code)) {
            objData.code = validator.trim(data.code)
        } 
        if (typeof data.rate !== "undefined" && !validator.isEmpty(data.rate)) {
            objData.rate = parseFloat(data.rate)
        }
        if (typeof data.minValue !== "undefined" && !validator.isEmpty(data.minValue)) {
            objData.minValue = parseFloat(data.minValue)
        }
        if (typeof data.maxValue !== "undefined" && !validator.isEmpty(data.maxValue)) {
            objData.maxValue = parseFloat(data.maxValue)
        }
        if (typeof data.usageLimit !== "undefined" && JSON.stringify(data.usageLimit) !== '{}') {
            objData.usageLimit = {
                limitType: validator.trim(data.usageLimit.limitType.toLowerCase()),
                maxOfUse: parseInt(data.usageLimit.maxOfUse)
            }
        }
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        } 

        // Set default values
        if (crudOption === 'create') {
            if (typeof data.status === "undefined" || validator.isEmpty(data.status)) {
                objData.status = DEFAULT_VALUES.status
            }
            if (data.description != null){
                objData.description = null
            }
            if (data.country != null){
                objData.country = null
            }
        }
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }
        
        return objData
    },

    order: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.totalCost !== "undefined" && !validator.isEmpty(data.totalCost)) {
            objData.totalCost = parseFloat(data.totalCost)
        }
        if (typeof data.shippingFee !== "undefined" && !validator.isEmpty(data.shippingFee)) {
            objData.shippingFee = parseFloat(data.shippingFee)
        } 
        if (typeof data.finalCost !== "undefined" && !validator.isEmpty(data.finalCost)) {
            objData.finalCost = parseFloat(data.finalCost)
        } 
        if (typeof data.currency !== "undefined" && !validator.isEmpty(data.currency)) {
            objData.currency = validator.trim(data.currency)
        }
        if (typeof data.paymentMethod !== "undefined" && !validator.isEmpty(data.paymentMethod)) {
            objData.paymentMethod = toCapitalize(validator.trim(data.paymentMethod))
        }
        if (typeof data.voucherCode !== "undefined" && !validator.isEmpty(data.voucherCode)) {
            objData.voucherCode =validator.trim(data.voucherCode)
        }
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        } 

        // Set default values
        if (crudOption === 'create') {
            if (typeof data.status === "undefined" || validator.isEmpty(data.status)) {
                objData.status = DEFAULT_VALUES.order.status
            }
        }
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }
        
        return objData
    },

    orderDetail: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.amount !== "undefined" && !validator.isEmpty(data.amount)) {
            objData.amount = parseInt(data.amount)
        }
        if (typeof data.totalCost !== "undefined" && !validator.isEmpty(data.totalCost)) {
            objData.totalCost = parseFloat(data.totalCost)
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

    storage: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.name !== "undefined" && !validator.isEmpty(data.name)) {
            objData.name = toCapitalize(validator.trim(data.name))
        }
        if (typeof data.propertyType !== "undefined" && !validator.isEmpty(data.propertyType)) {
            objData.shippingFee = validator.trim(data.name.toLowerCase())
        } 
        if (typeof data.capacity !== "undefined" && JSON.stringify(data.capacity) !== '{}') {
            objData.capacity.size = parseFloat(data.capacity.size)
            objData.capacity.unit = validator.trim(data.capacity.unit.toLowerCase())
        } 
        if (typeof data.description !== "undefined" && !validator.isEmpty(data.description)) {
            objData.description = toCapitalize(validator.trim(data.description))
        }
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        } 

        // Set default values
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }
        
        return objData
    },

    restock: ({ ...data } = {}, crudOption = null) => {
        let objData = data
        if (typeof data.action !== "undefined" && !validator.isEmpty(data.action)) {
            objData.action = validator.trim(data.action.toLowerCase())
        }
        if (typeof data.amount !== "undefined" && !validator.isEmpty(data.amount)) {
            objData.amount = parseInt(data.amount.toString())
        } 
        if (typeof data.status !== "undefined" && !validator.isEmpty(data.status)) {
            objData.status = validator.trim(data.status.toLowerCase())
        } 

        // Set default values
        if (crudOption === 'update') {
            objData.updatedAt = Date.now()
        }
        
        return objData
    },
}
