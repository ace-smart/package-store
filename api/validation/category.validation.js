const validator = require('validator')
const { isExistentCategoryName, hasError, hasUnknownKeys } = require('./validation');

const categoryFields = ['name','status','subcategories']

module.exports = {
    create: async ({...data}={}) => {
        // check null input
        if (JSON.stringify(data) === '{}') 
            return hasError({ input: 'No input data' })
        console.log(Object.keys(data))
        // check data contains unknown fields
        const unknownKeys = hasUnknownKeys(categoryFields, Object.keys(data))
        if (unknownKeys.length > 0)
            return hasError({ input: `Unknown input "${unknownKeys[0]}" ` })

        // validate name
        let nameErrors = Array()
        if (typeof data.name === 'undefined' || validator.isEmpty(data.name))
            nameErrors.push('Name is required.')
        if (!validator.isAlphanumeric(data.name))
            nameErrors.push('Name must contain only numbers and characters.')
        if (!validator.isLength(data.name, {min: 4, max: 40})) 
            nameErrors.push('Name is only allowed in range of 4 to 40 characters.')
        if (await isExistentCategoryName(data.name)) 
            nameErrors.push('Name is already existent.')
        
        return hasError({
            name: nameErrors
        })
        
    },

    update: async ({...data}={}, categoryId = null) => {
        // check null input
        if (JSON.stringify(data) === '{}' || !categoryId) 
            return hasError({ input: 'No input data' })

        // validate name
        let nameErrors = Array()
        if (typeof data.name !== 'undefined' && !validator.isEmpty(data.name)){
            if (!validator.isAlphanumeric(data.name)) 
                nameErrors.push('Name must contain only numbers and characters.')
            if (!validator.isLength(data.name, {min: 4, max: 50})) 
                nameErrors.push('Name is only allowed in range of 4 to 50 characters.')
            if (await isExistentCategoryName(data.name, categoryId)) 
                nameErrors.push('Name is already existent.')
        }
        
        // validate status
        let statusErrors = Array()
        if (typeof data.status !== 'undefined' && !validator.isEmpty(data.status)) {
            if (!validator.isIn(data.status.toLowerCase(), ['activated','deactivated'])){
                statusErrors.push('Status is not valid.')
            }
        }

        return hasError({
            name: nameErrors,
            statusErrors: statusErrors
        })
    },

}