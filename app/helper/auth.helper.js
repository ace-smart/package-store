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
            if (response.status === 200 && response.statusText === "OK") {
                if (response.data.success == true) {
                    return response.data.accessToken
                }

                return {
                    error: response.data.message,
                }
            }

            throw new Error("Renewing token failed.")
        } catch (error) {
            throw new Error(error)
        }
    },

    getUser: async ({ id, accessToken, refreshToken } = {}) => {
        try {
            const response = await axiosInstance.get(`/info/${id}`, {
                responseType: "json",
                responseEncoding: "utf-8",
                headers: { Authorization: "Bearer " + accessToken },
            })

            if (response.status === 200 && response.statusText === "OK") {
                if (response.data.success == true) {
                    return response.data.user
                }
                return {
                    error: response.data.message,
                }
            }

            if (response.status === 401 && response.data.message === "jwt expired") {
                const newAccessTK = await authHelper.renewAccessToken(refreshToken)
                if (newAccessTK.error == null) {
                    return await authHelper.getUser({ id, newAccessTK, refreshToken })
                }

                return { error: newAccessTK.error }
            }

            throw new Error("Get user information failed.")
        } catch (error) {
            throw new Error(error)
        }
    },

    _getEndpointUrl: (req, res, next) => {
        res.locals.path = req.path
    },

    _checkAuthenticatedAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "activated" && req.user.role === "admin")
            return next()

        return authHelper._redirectToLogin(req, res, next)
    },

    _checkAuthenticatedCustomer: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "activated" && req.user.role === "user")
            return next()

        return authHelper._redirectToLogin(req, res, next)
    },

    _checkUnauthenticated: (req, res, next) => {
        if (req.isUnauthenticated()) return next()

        return authHelper._redirectToIndex(req, res, next)
    },

    _redirectToIndex: (req, res, next) => {
        const urlSegments = req.originalUrl.split("/")
        const admin = urlSegments.find((element) => element === "admin")

        if (admin != null) res.redirect("/admin")

        res.redirect("/")
    },

    _redirectToLogin: (req, res, next) => {
        const urlSegments = req.originalUrl.split("/")
        const admin = urlSegments.find((element) => element === "admin")

        if (admin != null) res.redirect("/admin/login")

        res.redirect("/login")
    },
}
