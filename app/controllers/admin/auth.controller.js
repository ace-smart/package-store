const axios = require("axios")
const crypto = require('crypto')
const RememberMeModel = require("../../models/RememberMeModel")
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api`,
    timeout: 10000,
    // headers: {'Content-Type': 'application/json'}
})

module.exports = {
    // @desc:   show login form
    // @route:  GET /login
    showLoginForm: (req, res) => {
        res.render("templates/admin/auth/login", {
            layout: "admin/auth.layout.hbs",
            csrfToken: req.csrfToken(),
        })
    },

    // @desc:   authenticate user
    // @route:  GET /login
    rememberMeLogin: async (req, res, next) => {
        console.log(req.user)
        console.log((!req.body.remember_me))
        if (!req.body.remember_me) {
            return next()
        }

        try {
            const newRememberToken = crypto.randomBytes(16).toString('hex')
            const rememberMeData = await RememberMeModel.findOne({userId: req.user._id}).lean()
            if (rememberMeData == null) {
                // first time using remember_me option
                await RememberMeModel.create({
                    userId: req.user._id,
                    remember_token: newRememberToken,
                    access_token: req.user.accessToken,
                    refresh_token: req.user.refreshToken
                })
            }else {
                await RememberMeModel.updateOne(
                    {
                        userId: req.user._id,
                    },
                    {
                        remember_token: newRememberToken,
                    }
                )
            }

            // store in cookie
            res.cookie("remember_me", newRememberToken, {
                path: "/admin",
                httpOnly: true,
                maxAge: 3600*24*7,
            })
            
            return next()
        } catch (error) {
            throw new Error(error)
        }
    },
}
