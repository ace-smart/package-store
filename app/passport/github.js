const passport = require("passport")
const GithubStrategy = require("passport-github").Strategy
const axiosInstance = require("../helper/axios.helper")
const authHelper = require('../helper/auth.helper')

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const userData = {
          clientId: profile.id,
          provider: profile.provider,
          displayName: profile.username,
          email: profile._json.email ? profile._json.email : '',
          profile: {
            gender: profile.gender ? profile.gender : undefined,
            avatar: profile._json.avatar_url ? { urlLink: profile._json.avatar_url } : null,
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
