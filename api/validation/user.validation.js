const validator = require('validator')
const User = require('../models/UserModel')
const { isExistentEmail, isExistentUsername, hasError } = require('./validation');

module.exports = {
    create: async ({...data}={}) => {
        // check null input
        if (JSON.stringify(data) === '{}') 
            return hasError({ input: 'No input data' })

        // validate email
        let emailErrors = Array()
        if (typeof data.email === 'undefined' || validator.isEmpty(data.email))
            emailErrors.push('Email is required.')
        if (!validator.isEmail(data.email)) 
            emailErrors.push('Email is not valid.')
        if (!validator.isLength(data.email, { min: 0, max: 255})) 
            emailErrors.push('Email is only allowed in range of 4 to 255 characters.')
        if (await isExistentEmail(data.email)) 
            emailErrors.push('Email is already existent.')

        // validate username
        let usernameErrors = Array()
        if (typeof data.username === 'undefined' || validator.isEmpty(data.username))
            usernameErrors.push('Username is required.')
        if (!validator.isAlphanumeric(data.username)) 
            usernameErrors.push('Username must contain only numbers and characters.')
        if (!validator.isLength(data.username, {min: 4, max: 255})) 
            usernameErrors.push('Username is only allowed in range of 4 to 255 characters.')
        if (await isExistentUsername(data.username)) 
            usernameErrors.push('Username is already existent.')
        
        // validate password
        let pwdErrors = Array()
        if (typeof data.password === 'undefined' || validator.isEmpty(data.password)) 
            pwdErrors.push('Password is required.')
        if (!validator.isLength(data.password, {min: 4, max: 255})) 
            pwdErrors.push('Password is only allowed in range of 4 to 255 characters.')

        // validate role
        let roleErrors = Array()
        if (typeof data.role !== 'undefined' && !validator.isEmpty(data.role)) {
            if (!validator.isIn(data.role.toLowerCase(), ['user','admin'])){
                roleErrors.push('Role is not valid.')
            }
        }

        // validate role
        let statusErrors = Array()
        if (typeof data.status !== 'undefined' && !validator.isEmpty(data.status)) {
            if (!validator.isIn(data.status.toLowerCase(), ['activated','deactivated'])){
                statusErrors.push('Status is not valid.')
            }
        }
        
        return hasError({
            email: emailErrors,
            username: usernameErrors,
            password: pwdErrors,
            statusErrors: statusErrors,
            roleErrors: roleErrors
        })
        
    },

    update: async ({...data}={}, userId = null) => {
        // check null input
        if (JSON.stringify(data) === '{}' || !userId) 
            return hasError({ input: 'No input data' })

        // validate email
        let emailErrors = Array()
        if (typeof data.email !== 'undefined' && !validator.isEmpty(data.email)){
            if (!validator.isEmail(data.email)) 
                emailErrors.push('Email is not valid.')
            if (!validator.isLength(data.email, { max: 255})) 
                emailErrors.push('Email is only allowed in range of 4 to 255 characters.')
            if (await isExistentEmail(data.email, userId)) 
                emailErrors.push('Email is already existent.')
        }

        // validate username
        let usernameErrors = Array()
        if (typeof data.username !== 'undefined' && !validator.isEmpty(data.username)){
            if (!validator.isAlphanumeric(data.username)) 
                usernameErrors.push('Username must contain only numbers and characters.')
            if (!validator.isLength(data.username, {min: 4, max: 255})) 
                usernameErrors.push('Username is only allowed in range of 4 to 255 characters.')
            if (await isExistentUsername(data.username, userId)) 
                usernameErrors.push('Username is already existent.')
        }
        
        // validate password
        let pwdErrors = Array()
        if (typeof data.password !== 'undefined' && !validator.isEmpty(data.password)) {
            if (!validator.isLength(data.password, {min: 4, max: 255})) 
                pwdErrors.push('Password is only allowed in range of 4 to 255 characters.')
        }
        
        // validate role
        let roleErrors = Array()
        if (typeof data.role !== 'undefined' && !validator.isEmpty(data.role)) {
            if (!validator.isIn(data.role.toLowerCase(), ['user','admin'])){
                roleErrors.push('Role is not valid.')
            }
        }

        // validate role
        let statusErrors = Array()
        if (typeof data.status !== 'undefined' && !validator.isEmpty(data.status)) {
            if (!validator.isIn(data.status.toLowerCase(), ['activated','deactivated'])){
                statusErrors.push('Status is not valid.')
            }
        }

        return hasError({
            email: emailErrors,
            username: usernameErrors,
            password: pwdErrors,
            statusErrors: statusErrors,
            roleErrors: roleErrors
        })
    },

}