const LocalStrategy = require("passport-local").Strategy
const RememberStrategy = require("passport-remember-me").Strategy
const RememberMeModel = require("../models/RememberMeModel")
const crypto = require("crypto")
const authHelper = require("../helper/auth.helper")

module.exports = async function (passport) {
    const validate = async function (username, password, done) {
        try {
            const admin = await authHelper.validateUser(username, password, "admin")

            if (admin.error != null) return done(null, false, { message: admin.error })

            if (admin.status !== "activated")
                return done(null, false, { message: "Your account is not allowed to log in." })

            if (admin.role !== "admin")
                return done(null, false, {
                    message: "Your account does not have access to this site",
                })

            return done(null, admin)
        } catch (error) {
            return done(error)
        }
    }

    const issueRememberTK = async ({ id, accessToken, refreshToken }, done) => {
        const newRememberMeTk = crypto.randomBytes(16).toString("hex")
        try {
            const updatedToken = await RememberMeModel.findOneAndUpdate(
                { userId: id },
                { remember_token: newRememberMeTk },
                { new: true }
            ).lean()

            if (updatedToken) return done(null, newRememberMeTk)

            return done(null, false, { message: "Failed to create new remember token." })
        } catch (error) {
            return done(error)
        }
    }

    const consumeRememberTK = async (token, done) => {
        try {
            const isExistentTK = await RememberMeModel.findOne({ remember_token: token }).lean()

            if (isExistentTK) {
                const updatedToken = await RememberMeModel.findOneAndUpdate(
                    { remember_token: token },
                    { remember_token: null },
                    { new: true }
                )

                if (updated)
                    return done(null, {
                        id: updatedToken.userId,
                        accessToken: updatedToken.access_token,
                        refreshToken: updatedToken.refresh_token,
                    })
            }

            return done(null, false, { message: "Invalid remember token." })
        } catch (error) {
            return done(error)
        }
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
            },
            validate
        )
    )

    passport.use(
        new RememberStrategy(
            consumeRememberTK,
            issueRememberTK
        )
    )

    passport.serializeUser(function (admin, done) {
        done(null, {
            id: admin._id,
            accessToken: admin.accessToken,
            refreshToken: admin.refreshToken,
        })
    })

    passport.deserializeUser(async function (adminData, done) {
        try {
            const admin = await authHelper.getUser({ ...adminData })

            return done(admin.error, admin)
        } catch (error) {
            return done(error)
        }
    })
}
