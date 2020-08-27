const User = require("../models/UserModel")
const authHelper = require("../helper/auth")

module.exports = {
    // @desc    Authenticate
    // @route   POST /auth
    auth: async (req, res) => {
        try {
            const isAuthenticatedUser = await authHelper.isAuthenticatedUser({ ...req.body })
            
            if (isAuthenticatedUser) {
                // Not activated
                if (isAuthenticatedUser.message != null)
                    return res
                        .status(401)
                        .json({ success: false, message: isAuthenticatedUser.message })

                // Generate tokens
                const newTokens = {}
                if (isAuthenticatedUser.accessToken == null){
                    newTokens.accessToken = authHelper.generateAccessToken(isAuthenticatedUser, {
                        expiresIn: "1d",
                    })
                } else if (authHelper.authenticateAccessToken(isAuthenticatedUser.accessToken).id != null){
                    newTokens.accessToken = isAuthenticatedUser.accessToken
                } else if (authHelper.authenticateAccessToken(isAuthenticatedUser.accessToken).error != null){
                    newTokens.accessToken = authHelper.generateAccessToken(isAuthenticatedUser, {
                        expiresIn: "1d",
                    })
                }
                

                if (isAuthenticatedUser.refreshToken == null) {
                    newTokens.refreshToken = await authHelper.generateRefreshToken(isAuthenticatedUser) 
                } else {
                    newTokens.refreshToken = isAuthenticatedUser.refreshToken
                }
                const updated = await User.findOneAndUpdate(
                    { _id: isAuthenticatedUser._id },
                    {
                        accessToken: newTokens.accessToken,
                        refreshToken: newTokens.refreshToken,
                    },
                    { new: true }
                )
                if (updated)
                    return res.status(200).json({
                        success: true,
                        user: updated,
                        // accessToken: accessToken,
                        // refreshToken: refreshToken,
                    })
                else
                    return res
                        .status(500)
                        .json({ success: false, message: "Authentication failed." })
            }
            // Bad username or password
            return res.status(401).json({
                success: false,
                message: "Authentication failed. Please check username or password.",
            })
        } catch (error) {
            console.error(error)
            return res.status(401).json({ success: false, message: error.message })
        }
    },

    // @desc:    Renew access token by refresh token
    // @route:   POST /token
    renewAccessToken: async (req, res) => {
        try {
            const refreshTokenHeader = req.header("x-refresh-token")
            // No token
            if (typeof refreshTokenHeader === "undefined")
                return res.status(401).json({ success: false, message: "Missing refresh token." })

            const refreshToken = req.header("x-refresh-token").split(" ")[1]

            // Not 'Bearer token'
            if (typeof refreshToken === "undefined")
                return res.status(401).json({ success: false, message: "Invalid token." })

            const userFromToken = await User.findOne({ refreshToken: refreshToken }).lean()

            if (userFromToken) {
                // Generate new access token
                const updated = await User.findOneAndUpdate(
                    { _id: userFromToken._id },
                    {
                        accessToken: authHelper.generateAccessToken(userFromToken, {
                            expiresIn: "1d",
                        }),
                    },
                    { new: true } )
                if (updated)
                    return res.status(200).json({
                        success: true,
                        accessToken: updated.accessToken,
                    })
            }

            return res.status(401).json({
                success: false,
                message: "Incorrect token.",
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    },


    // @desc:   get account information by accessTK
    // @route:  GET /info/:id
    getInfo: async (req, res) => {
        try {
            const user = await User.findOne({$and :[{_id: req.params.id},{accessToken: req.user.accessToken}]}).lean()
            if (user != null) 
                return res.status(200).json({
                    success: true,
                    user: user
                })

            return res.status(200).json({
                success: false,
                message: 'No user found.'
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({success: false, message: error.message})
        }
    },

    // @desc:   Logout by userId
    // @route:  POST /logout
    logout: async (req, res) => {
        if (req.user != null) {
            try {
                const updated = await User.findOneAndUpdate({_id: req.user.id}, {
                    accessToken: null,
                    refreshToken: null
                }, {new: true})
    
                // Check given property
                if (updated) return res.sendStatus(200)
            } catch (error) {
                console.error(error)
                return res.status(500).json({success: false, message: error.message})
            }
            
        }

        return res.status(403).json({ success: false, message: "No authentication found." })
        
    },
}
