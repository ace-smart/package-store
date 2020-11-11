const LocalStrategy = require("passport-local").Strategy
const RememberStrategy = require("passport-remember-me").Strategy
const authHelper = require("../helper/auth.helper")

module.exports = async function (passport) {
  const validate = async function (username, password, done) {
    try {
      const validation = await authHelper.validateUser(username, password, "admin")
      if (validation.error != null) {
        if (validation.error.name === "ValidationError") {
          return done(null, false, { message: validation.error.invalidation[0].message })
        } else {
          throw new Error(validation.error.message)
        }
      }

      return done(null, validation.user)
    } catch (error) {
      return done(error)
    }
  }

  const issueRememberTK = async ({ accessToken, refreshToken }, done) => {
    try {
      const newRememberMeTk = await authHelper.updateRememberToken({ accessToken, refreshToken })

      if (newRememberMeTk) {
        return done(null, {
          rememberToken: newRememberMeTk,
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      }

      return done(null, false, { message: "Failed to create new remember token." })
    } catch (error) {
      return done(error)
    }
  }

  const consumeRememberTK = async ({ rememberToken, accessToken, refreshToken }, done) => {
    try {
      const userData = await authHelper.getUserByRememberToken({
        accessToken,
        refreshToken,
        rememberToken,
      })

      if (userData.user) {
        const newRememberTK = await authHelper.updateRememberToken({ accessToken, refreshToken })
        if (newRememberTK) {
          return done(null, userData.user)
        }
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

  passport.use(new RememberStrategy(consumeRememberTK, issueRememberTK))

  passport.serializeUser(function (admin, done) {
    return done(null, {
      accessToken: admin.accessToken,
      refreshToken: admin.refreshToken,
    })
  })

  passport.deserializeUser(async function (adminData, done) {
    const resData = await authHelper.getLoggedUser({ ...adminData })
    if (resData.user) {
      return done(null, resData.user)
    }

    if (resData.status >= 400 && resData.data.error) {
      if (resData.status === 401 && resData.data.error.name === "TokenExpiredError") {
        try {
          const newAccessTK = await authHelper.renewAccessToken(adminData.refreshToken)
          const userData = await authHelper.getLoggedUser({
            accessToken: newAccessTK,
            refreshToken: adminData.refreshToken,
          })
          
          return done(null, userData.user)
        } catch (error) {
          return done(error)
        }
      }

      return done(resData.data.error)
    }
  })
}
