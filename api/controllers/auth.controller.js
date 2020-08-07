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
                const accessToken = authHelper.generateAccessToken(isAuthenticatedUser, {
                    expiresIn: "1d",
                })
                const refreshToken = await authHelper.generateRefreshToken(isAuthenticatedUser)
                const updated = await User.findOneAndUpdate(
                    { _id: isAuthenticatedUser._id },
                    {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    },
                    { new: true }
                )
                if (updated)
                    return res.status(200).json({
                        success: true,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
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
            return res.status(401).json({ success: false, message: error.message })
        }
    },

    // @desc:   Logout by userId
    // @route:  POST /logout
    logout: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.body.id.toString() })

            if (user) {
                const updated = await User.findOneAndUpdate({_id: req.body.id}, {
                    accessToken: null,
                    refreshToken: null
                }, {new: true})

                // Check given property
                if (updated) return res.status(204)
            }

            return res.status(404).json({ success: false, message: "Invalid id." })
        } catch (error) {
            console.error(error)
            return res.status(500).json({success: false, message: error.message})
        }
    },
}
