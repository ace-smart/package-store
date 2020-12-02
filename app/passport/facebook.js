const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy
const axiosInstance = require("../helper/axios.helper")
const authHelper = require('../helper/auth.helper')

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'birthday']
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const userData = {
          clientId: profile.id,
          provider: profile.provider,
          displayName: profile.displayName,
          email: profile._json.email ? profile._json.email : '',
          profile: {
            lastName: profile.name.familyName ? profile.name.familyName : '',
            firstName: profile.name.givenName ? profile.name.givenName : '',
            gender: profile.gender ? profile.gender : undefined,
            avatar: profile._json.picture ? { urlLink: profile._json.picture.data.url } : null,
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
