const axiosInstance = require("../helper/axios.helper")
const helper = require("../helper/helper")
const crypto = require("crypto")

module.exports = authHelper = {
  validateUser: async (username, password, role) => {
    if (typeof role === "undefined" || role == null) {
      throw new Error("Can not validate with unknown role")
    }

    try {
      const response = await axiosInstance.post(`/auth?role=${role}`, {
        username: username.toString().toLowerCase(),
        password: password.toString(),
      })

      if (response.status === 200 && response.statusText === "OK") {
        return { user: response.data }
      }
    } catch (error) {
      /**   SERVER RESPONSE
       * error: {
            name: 'ValidationError',
            message: 'Validation failed.',
            invalidation: [
              {
                field: 'password',
                message: 'Incorrect password.',
                value: '1234'
              }
            ]
        } */
      if (error.response.status >= 400) {
        return { error: error.response.data.error }
      }

      throw new Error(error)
    }
  },

  renewAccessToken: async (refreshToken = null) => {
    try {
      const response = await axiosInstance.get("/token", {
        headers: { "x-refresh-token": "Bearer " + refreshToken },
      })
      if (response.status === 200) {
        return response.data.accessToken
      }
    } catch (error) {
      if (error.response.status >= 400) {
        return { error: error.response.data.error }
      }

      throw new Error(error)
    }
  },

  getUser: async ({ accessToken, refreshToken } = {}) => {
    try {
      const response = await axiosInstance.get(`/get-user-data`, {
        headers: { Authorization: "Bearer " + accessToken },
      })

      if (response.status === 200 && response.statusText === "OK") {
        return { user: response.data }
      }
    } catch (error) {
      if (error.response.status >= 400) {
        if (
          error.response.status === 401 &&
          error.response.data.error.name === "TokenExpiredError"
        ) {
          const newAccessTK = await authHelper.renewAccessToken(refreshToken)
          return await authHelper.getUser({ accessToken: newAccessTK, refreshToken })
        }
        return { error: error.response.data.error }
      }

      throw new Error(error.message)
    }
  },

  getProfile: async ({ id, accessToken, refreshToken } = {}) => {
    try {
      const response = await axiosInstance.get(`/profile`, {
        headers: { Authorization: "Bearer " + accessToken },
      })

      if (response.status === 200 && response.statusText === "OK") {
        return { user: response.data }
      }
    } catch (error) {
      if (error.response.status >= 400) {
        if (
          error.response.status === 401 &&
          error.response.data.error.name === "TokenExpiredError"
        ) {
          const newAccessTK = await authHelper.renewAccessToken(refreshToken)
          return await authHelper.getProfile({ id, accessToken: newAccessTK, refreshToken })
        }
        return { error: error.response.data.error }
      }

      throw new Error(error.message)
    }
  },

  getUserByRememberToken: async ({ accessToken, refreshToken, rememberToken } = {}) => {
    try {
      const response = await axiosInstance.get(`/remember-token?rememberToken=${rememberToken}`, {
        headers: { Authorization: "Bearer " + accessToken },
      })

      if (response.status === 200 && response.statusText === "OK") {
        return { user: response.data }
      }
    } catch (error) {
      if (error.response.status >= 400) {
        if (
          error.response.status === 401 &&
          error.response.data.error.name === "TokenExpiredError"
        ) {
          const newAccessTK = await authHelper.renewAccessToken(refreshToken)
          return await authHelper.getRememberToken({
            accessToken: newAccessTK,
            refreshToken,
            rememberToken,
          })
        }
        return { error: error.response.data.error }
      }

      throw new Error(error.message)
    }
  },

  updateRememberToken: async ({ accessToken, refreshToken } = {}) => {
    try {
      const newRememberMeTk = crypto.randomBytes(16).toString("hex")
      const response = await axiosInstance.put(
        `/remember-token`,
        {
          rememberToken: newRememberMeTk,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      )
      
      if (response.status === 204) {
        return newRememberMeTk
      }
    } catch (error) {
      if (error.response.status >= 400) {
        if (
          error.response.status === 401 &&
          error.response.data.error.name === "TokenExpiredError"
        ) {
          const newAccessTK = await authHelper.renewAccessToken(refreshToken)
          return await authHelper.updateRememberToken({ accessToken: newAccessTK, refreshToken })
        }
        return { error: error.response.data.error }
      }

      throw new Error(error.message)
    }
  },

  _checkAuthenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.status === "activated" && req.user.role === "admin") {
        return next()
      }
      
      return helper.renderForbiddenPage(res, "admin")
    }

    return authHelper._redirectToLogin(req, res, next)
  },

  _checkAuthenticatedCustomer: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.status === "activated" && req.user.role === "user") {
        return next()
      }

      return helper.renderForbiddenPage(res, "user")
    }

    return authHelper._redirectToLogin(req, res, next)
  },

  _checkUnauthenticatedAdmin: (req, res, next) => {
    if (req.isUnauthenticated()) {
        return next()
    } else if (req.user.status !== "activated" || req.user.role !== "admin") {
      console.log(1)
      req.logout()
      return res.render("templates/admin/auth/login", {
        layout: "admin/auth.layout.hbs",
        csrfToken: req.csrfToken(),
      })
    }

    return authHelper._redirectToIndex(req, res, next)
  },

  _checkUnauthenticatedCustomer: (req, res, next) => {
    if (req.isUnauthenticated()) return next()

    return authHelper._redirectToIndex(req, res, next)
  },

  _redirectToIndex: (req, res, next) => {
    const urlSegments = req.originalUrl.split("/")
    const admin = urlSegments.find((element) => element === "admin")

    if (admin != null) return res.redirect("/admin")

    return res.redirect("/")
  },

  _redirectToLogin: (req, res, next) => {
    const urlSegments = req.originalUrl.split("/")
    const admin = urlSegments.find((element) => element === "admin")

    if (admin != null) return res.redirect("/admin/login")

    return res.redirect("/login")
  },

  _loginWithCookie: async (req, res, next) => {
    if (req.cookies['remember_me'] != null) {
      const userData = await authHelper.getUser({...req.cookies['remember_me']})
      
      if (userData) {
        req.logIn(userData.user, function(err) {
          if (err) { throw new Error(err) }

        })
      }
    }
    
    return next()
  }
}
