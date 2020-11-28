module.exports = {
  // @desc:   Show login form
  // @route:  GET /login
  showLoginForm: (req, res) => {
    return res.render("templates/admin/auth/login", {
      layout: "admin/auth.layout.hbs",
      csrfToken: req.csrfToken(),
    })
  },

  // @desc:   Store tokens in cookie
  _storeTokensBySession: (req, res, next) => {
    const tokens = {
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken
    }
    let expires = 0
    
    if  (req.body.remember_me) {
      expires = new Date(Date.now() + 1000 * 3600 * 24 * 7)  // 7 days
      tokens.rememberMe = true
    }

    res.cookie(
      "tokens",
      tokens,
      {
        path: "/admin",
        httpOnly: true,
        secure: false,
        expires
      }
    )
    
    return next()
  },
}
