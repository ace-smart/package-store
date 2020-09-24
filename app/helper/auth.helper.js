const axios = require("axios")
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api`,
    timeout: 10000,
    validateStatus: function (status) {
        return status < 500 // Resolve only if the status code is less than 500
    },
})

module.exports = authHelper = {
    validateUser: async (username, password, role) => {
        if (typeof role === "undefined" || role == null) {
            throw new Error("Can not validate with unknown role")
        }

        try {
            const response = await axiosInstance.post(
                "/auth",
                {
                    username: username.toString().toLowerCase(),
                    password: password.toString(),
                },
                {
                    responseType: "json",
                    responseEncoding: "utf-8",
                }
            )

            if (response.status === 200 && response.statusText === "OK") {
                if (response.data.success == true) {
                    if (response.data.user.role === role) return response.data.user

                    return { error: "Your account has no access to this  site." }
                }
            }

            return {
                error: response.data.message,
            }
        } catch (error) {
            throw new Error(error)
        }
    },

    renewAccessToken: async (refreshToken = null) => {
        try {
            const response = await axiosInstance.get("/token", {
                responseType: "json",
                responseEncoding: "utf-8",
                headers: { "x-refresh-token": "Bearer " + refreshToken },
            })
            if (response.status === 200) {
                if (response.data.success == true) {
                    return response.data.accessToken
                }
            }

            throw new Error(response.data.error.message)
        } catch (error) {
            throw new Error(error)
        }
    },

    getUser: async ({ id, accessToken, refreshToken } = {}) => {
        try {
            const response = await axiosInstance.get(`/profile`, {
                headers: { Authorization: "Bearer " + accessToken },
            })
            
            if (response.status === 200 && response.statusText === "OK") {
                if (response.data.success == true) {
                    return response.data.user
                }
            }
            
            if (response.status === 401 && response.data.error.message === "jwt expired") {
                const newAccessTK = await authHelper.renewAccessToken(refreshToken)
                return await authHelper.getUser({ id, accessToken: newAccessTK, refreshToken })
            }

            throw new Error(response.status.message)
        } catch (error) {
            console.log(error.message)
            throw new Error("Server error")
        }
    },
    
    _checkAuthenticatedAdmin: (req, res, next) => {
        if (req.isAuthenticated()){
            if (req.user.status === "activated"){
                if (req.user.role === "admin"){
                    return next()
                }
            }
            
            return authHelper._redirectForNotAllowed(req,res,next)
        }

        return authHelper._redirectToLogin(req, res, next)
        // return res.redirect('/admin/login')
    },

    _checkAuthenticatedCustomer: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "activated" && req.user.role === "user")
            return next()

        // return authHelper._redirectToLogin(req, res, next)
        return res.redirect('/login')
    },

    _checkUnauthenticatedAdmin: (req, res, next) => {
        if (req.isUnauthenticated()) return next()

        return res.redirect('/admin')
    },

    _checkUnauthenticatedCustomer: (req, res, next) => {
        if (req.isUnauthenticated()) return next()

        return res.redirect('/')
    },

    _redirectToIndex: (req, res, next) => {
        const urlSegments = req.originalUrl.split("/")
        const admin = urlSegments.find((element) => element === "admin")

        if (admin != null) 
            return res.redirect("/admin")

        return res.redirect("/")
    },

    _redirectToLogin: (req, res, next) => {
        const urlSegments = req.originalUrl.split("/")
        const admin = urlSegments.find((element) => element === "admin")

        if (admin != null) 
            return res.redirect("/admin/login")

        return res.redirect("/login")
    },

    _redirectForNotAllowed: (req, res, next) => {
        const urlSegments = req.originalUrl.split("/")
        const admin = urlSegments.find((element) => element === "admin")

        if (admin != null){
            req.flash('error', 'This account is not allowed for this site.')
            return res.render("templates/admin/auth/login", {
                layout: "admin/auth.layout.hbs",
                csrfToken: req.csrfToken(),
                // messages: {
                //     error: "This account is not allowed for this site."
                // }
            })
        }

        return res.redirect("/login")
    },

}
