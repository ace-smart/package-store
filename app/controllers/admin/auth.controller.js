const authHelper = require('../../helper/auth.helper')

module.exports = {
    // @desc:   show login form
    // @route:  GET /login
    showLoginForm: (req, res) => {
        return res.render("templates/admin/auth/login", {
            layout: "admin/auth.layout.hbs",
            csrfToken: req.csrfToken(),
        })
    },

    // @desc:   remember user
    // @route:  GET /login
    rememberMeLogin: async (req, res, next) => {
        if (!req.body.remember_me) {
            return next()
        }

        try {
            const newRememberToken = await authHelper.updateRememberToken({...req.user})
            
            if (newRememberToken) {
                // store in cookie
                res.cookie("remember_me", 
                {
                    accessToken: req.user.accessToken,
                    refreshToken: req.user.refreshToken,
                    rememberToken: newRememberToken
                }, 
                {
                    path: "/admin",
                    httpOnly: true,
                    secure: false, 
                    maxAge: 1000*3600*24*7
                })
            }
            
            return next()
        } catch (error) {
            throw new Error(error)
        }
    },
}
