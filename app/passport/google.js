const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const axiosInstance = require("../helper/axios.helper")
const authHelper = require('../helper/auth.helper')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const userData = {
          clientId: profile.id,
          provider: profile.provider,
          displayName: profile.displayName,
          email: profile._json.email ? profile._json.email : '',
          profile: {
            lastName: profile.name.familyName ? profile.name.familyName : undefined,
            firstName: profile.name.givenName ? profile.name.givenName : undefined,
            gender: profile.gender ? profile.gender : undefined,
            avatar: profile._json.picture ? { urlLink: profile._json.picture } : null,
          },
        }
        const response = await axiosInstance.post(
          `/oauth?providerName=${userData.provider}&clientId=${userData.clientId}`, userData
        )
        // Existent
        if (response.status === 200) {
          done(null, response.data)
        }
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser(function (account, done) {
  return done(null, {
    accessToken: account.accessToken,
    refreshToken: account.refreshToken,
  })
})

passport.deserializeUser(async function (accountData, done) {
  const resData = await authHelper.getLoggedUser({ ...accountData })
  if (resData.user) {
    return done(null, resData.user)
  }

  if (resData.status >= 400 && resData.data.error) {
    // Renew accessToken and then get data
    if (resData.status === 401 && resData.data.error.name === "TokenExpiredError") {
      try {
        const newAccessTK = await authHelper.renewAccessToken(accountData.refreshToken)
        const userData = await authHelper.getLoggedUser({
          accessToken: newAccessTK,
          refreshToken: accountData.refreshToken,
        })

        return done(null, userData.user)
      } catch (error) {
        return done(error)
      }
    }

    return done(resData.data.error)
  }
})
