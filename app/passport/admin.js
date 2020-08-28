const LocalStrategy = require("passport-local").Strategy
const authHelper = require('../helper/auth.helper')

module.exports = async function (passport) {
    const validate = async function (username, password, done) {
        try {
            const admin = await authHelper.validateUser(username, password, 'admin')
            
            if (admin.error != null) 
                return done(null, false, {message: admin.error})
            
            if (admin.status !== 'activated')
                return done(null, false, {message: 'Your account is not allowed to log in.'})
            
            if (admin.role !== 'admin')
                return done(null, false, {message: 'Your account does not have access to this site'})

            return done(null, admin)
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

    passport.serializeUser(function (admin, done) {
        done(null, {id: admin._id, accessToken: admin.accessToken, refreshToken: admin.refreshToken})
    })

    passport.deserializeUser(async function (adminData, done) {
        try {
            const admin = await authHelper.getUser({...adminData})
            
            return done(admin.error, admin)
        } catch (error) {
            return done(error)
        }
    })
}
