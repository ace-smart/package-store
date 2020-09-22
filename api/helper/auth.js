const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const User = require("../models/UserModel")
const { outputErrors } = require("../validation/validation")

module.exports = authHelper = {
    //@desc:    Generate access token
    //Args:     [ {user}, {options} ]
    //Return:   <String> accessToken
    generateAccessToken: ({...user} = {}, { ...opts } = {}) => {
        if (JSON.stringify(user) === "{}")
            throw new Error("Can not generate access token without payload.")

        if (typeof opts.expiresIn === "undefined")
            throw new Error("Can not generate access token without expiration.")

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
            status: user.status
        }
        
        return jwt.sign(payload, process.env.ACCESSTOKEN_SECRET, opts)
    },

    //@desc:    Generate refresh token with no expiration
    //Args:     [ {user}, {options} ]
    //Return:   <String> refreshToken
    generateRefreshToken: ({ ...user } = {}, { ...opts } = {}) => {
        if (JSON.stringify(user) === "{}")
            throw new Error("Can not generate refresh token without payload.")

        // no expiration
        delete opts.expiresIn

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
            status: user.status
        }

        const userSecretKey = user.refresh_secret + process.env.REFRESHTOKEN_SECRET

        return jwt.sign(payload, userSecretKey, opts)
    },

    //@desc:    Verify access token
    //Args:     [ <String> accessToken, {options} ]
    //Return:   { payload }
    authenticateAccessToken: (accessToken = null, { ...opts } = {}) => {
        if (!accessToken) throw new Error("No access token is given.")

        return jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET, opts, (err, decoded) => {
            if (err) return {error: err}
            return decoded
        })
    },

    //@desc:    Middleware for checking access token
    //Return:   req.user = {user}
    _ensureAccessToken: async (req, res, next) => {
        const accessTokenHeader = req.header("Authorization")
        // No token
        if (typeof accessTokenHeader === "undefined")
            return res
                .status(401)
                .json({ success: false, error: { type: "accessToken", message: "Missing access token." } })

        const accessToken = req.header("Authorization").split(" ")[1]

        // Not 'Bearer token'
        if (typeof accessToken === "undefined" || !accessToken)
            return res
                .status(401)
                .json({ success: false, error: { type: "accessToken", message: "Invalid token." } })

        try {
            const payload = authHelper.authenticateAccessToken(accessToken)
            // Jwt has errors 
            if (typeof payload.error !== "undefined")
                return res
                    .status(401)
                    .json({
                        success: false,
                        error: { type: "accessToken", message: payload.error.message },
                    })

            // Check accessToken is in database
            const isExistent = await User.findOne({accessToken: accessToken})
            
            if (isExistent) {
                req.user = payload
                req.user.accessToken = accessToken
                return next()
            }

            return res
                .status(401)
                .json({ success: false, error: { type: "accessToken", message: "Invalid token." } })
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({
                    success: false,
                    error: { type: "accessToken", message: outputErrors(error.message) },
                })
        }
    },

    // @desc    Authenticate user
    // Args:    { username, password }
    // Return:  Authenticated => { user }
    //          Not Authenticated => False 
    isAuthenticatedUser: async ({ ...user } = {}) => {
        if (JSON.stringify(user) === "{}") return false

        try {
            const userFromDb = await User.findOne({ username: user.username}).lean()
            if (userFromDb) {
                // Check status
                if (userFromDb.status === 'activated') {
                    // Check password
                    const matchedPwd = await bcrypt.compare(user.password, userFromDb.password)
                    if (matchedPwd) return userFromDb
                } else return {message: 'Not activated'}
            }
            return false
        } catch (error) {
            return error.message
        }
    },
    
    //@desc:    Middleware for checking 'admin' role
    //Return:   req.user = {user}
    _ensureAdminRole: (req, res, next) => {
        if (typeof req.user !== 'undefined' && req.user.role != null && req.user.role.toLowerCase() === 'admin'){
            return next()
        }
        
        return res.status(403).json({ success: false, error: {message: 'Forbidden.'} })
    },
    
}
