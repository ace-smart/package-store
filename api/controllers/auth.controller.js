const User = require("../models/UserModel")
const Profile = require("../models/ProfileModel")
const bcrypt = require("bcrypt")
const authHelper = require("../helper/auth")
const { validate_add_inp, validate_update_inp } = require("../validation/profile")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

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
                if (isAuthenticatedUser.accessToken == null) {
                    newTokens.accessToken = authHelper.generateAccessToken(isAuthenticatedUser, {
                        expiresIn: "1d",
                    })
                } else if (
                    authHelper.authenticateAccessToken(isAuthenticatedUser.accessToken).id != null
                ) {
                    // keep the old accessToken in DB if it was not expired
                    newTokens.accessToken = isAuthenticatedUser.accessToken
                } else if (
                    authHelper.authenticateAccessToken(isAuthenticatedUser.accessToken).error !=
                    null
                ) {
                    // generate new accessToken when the old one was expired
                    newTokens.accessToken = authHelper.generateAccessToken(isAuthenticatedUser, {
                        expiresIn: "1d",
                    })
                }

                if (isAuthenticatedUser.refreshToken == null) {
                    newTokens.refreshToken = await authHelper.generateRefreshToken(
                        isAuthenticatedUser
                    )
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
                    { new: true }
                )
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

    // @desc:   get profile by accessTK
    // @route:  GET /profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findOne({ accessToken: req.user.accessToken })
                .populate({
                    path: "profileId",
                })
                .lean()

            if (user != null)
                return res.status(200).json({
                    success: true,
                    user: user,
                })

            return res.status(200).json({
                success: false,
                message: "No user found.",
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   update profile by accessTK
    // @route:  PUT /profile
    updateProfile: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user.id }).select('profileId')
            if (user.profileId != null) {
                // update profile
                if (validate_update_inp({ ...req.body })) {
                    let profileData = sanitize.profile({ ...req.body }, "update")
                    await Profile.findOneAndUpdate({ _id: user.profileId }, profileData)
                    return res.sendStatus(204)
                }
            } else {
                // create profile
                if (validate_add_inp({ ...req.body })) {
                    let profileData = sanitize.profile({ ...req.body }, "create")
                    const profile = await Profile.create(profileData)
                    await User.findOneAndUpdate(
                        { accessToken: req.user.accessToken },
                        { profileId: profile._id }
                    )
                    return res.sendStatus(204)
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc:   change password by accessTK
    // @route:  POST /changePwd
    changePwd: async (req, res) => {
        try {
            const newPwd = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
            const updated = await User.findOneAndUpdate(
                { _id: req.user.id },
                { password: newPwd },
                { new: true }
            )
            if (updated != null) return res.sendStatus(204)

            return res.status(400).json({ success: false, message: "Failed to change password." })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   Logout by userId
    // @route:  POST /logout
    logout: async (req, res) => {
        if (req.user != null) {
            try {
                const updated = await User.findOneAndUpdate(
                    { _id: req.user.id },
                    {
                        accessToken: null,
                        refreshToken: null,
                    },
                    { new: true }
                )

                // Check given property
                if (updated) return res.sendStatus(200)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ success: false, message: error.message })
            }
        }

        return res.status(403).json({ success: false, message: "No authentication found." })
    },
}
