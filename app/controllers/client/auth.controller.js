const axiosInstance = require("../../helper/axios.helper")
const {
  handleErrors,
  handleInvalidationErrors,
  getValidFields,
  renderForbiddenPage,
} = require("../../helper/helper")
module.exports = {
  // @desc:   show register page
  // @route:  GET /register
  showRegisterPage: (req, res) => {
    return res.render("templates/client/auth/auth.hbs", {
      auth: "register",
      layout: "client/index.layout.hbs",
      csrfToken: req.csrfToken(),
    })
  },

  // @desc:		register
  // @route:	POST /register
  register: async (req, res) => {
    try {
      const response = await axiosInstance.post(`/register`, req.body)

      if (response.status === 201) {
        req.flash(
          "success",
          "A link for activation was sent to your email. Please check your email!"
        )
        return res.render("templates/client/auth/auth.hbs", {
          auth: "register",
          layout: "client/index.layout.hbs",
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.error.invalidation) {
          const errors = error.response.data.error.invalidation
          const validData = getValidFields(errors, req.body)

          req.flash("fail", "Your input is not valid.")
          return res.render("templates/client/auth/auth.hbs", {
            auth: "register",
            layout: "client/index.layout.hbs",
            csrfToken: req.csrfToken(),
            errors: handleInvalidationErrors(errors),
            validData: validData,
          })
        } else if (error.response.data.error.message) {
          req.flash("fail", "Your input is not valid.")
          return res.redirect("/register")
        }
      }

      return handleErrors(res, error, "user")
    }
	},
	
  // @desc:   show register page
  // @route:  GET /resend-activation
  showResendActivationPage: (req, res) => {
    return res.render("templates/client/auth/auth.hbs", {
      auth: "resend-activation",
      layout: "client/index.layout.hbs",
      csrfToken: req.csrfToken(),
    })
	},

	// @desc:		send activation email
	// @route:	POST /resend-activation
	resendActivation: async (req,res) => {
		try {
			const response = await axiosInstance.post(`/resend-confirm-email`, {...req.body})

			if (response.status === 200) {
				req.flash('success', 'An new activation was sent to your email. Please check your email.')
				return res.redirect('/resend-activation')
			}
		} catch (error) {
			if (error.response.status === 400) {
				req.flash('fail', error.response.data.error.message)
				return res.redirect('/resend-activation')
			}
			return handleErrors(res, error, 'user')
		}
	},
	
	// @desc:		activate an user account
	// @route: 	GET /activate?email=example@email.com&confirmString=12345
	activateUser: async (req,res) => {
		try {
			const response = await axiosInstance.get(`/confirm-email?email=${req.query.email}&confirmString=${req.query.confirmString}`)
			if (response.status === 204) {
				req.flash('success', 'Your account is now activated. You can login now.')
				return res.redirect('/login')
			}
		} catch (error) {
			return handleErrors(res, error, 'user')
		}
	},

	// @desc:		show forget password page
	// @route		GET /forget-password?email=example@email.com
	showForgetPwdPage: (req, res) => {
    return res.render("templates/client/auth/auth.hbs", {
      auth: "forget-password",
			layout: "client/index.layout.hbs",
			csrfToken: req.csrfToken()
    })
	},

	// @desc:		send forget password email
	// @route:	POST /forget-password
	sendForgetPwdEmail: async (req, res) => {
		try {
			const response = await axiosInstance.post(`/reset-password`, {...req.body})

			if (response.status === 200) {
				req.flash('success', 'An email was sent to your email. Please check your email and set your new password.')
				return res.redirect('/forget-password')
			}
		} catch (error) {
			if (error.response.status === 400) {
				req.flash('fail', error.response.data.error.message)
				return res.redirect('/forget-password')
			}
			return handleErrors(res, error, 'user')
		}
	},

	// @desc:		show reset password page
	// @route		GET /reset-password?email=email@exmaple.com&confirmString=12345qwerty
	showResetPwdPage: async (req, res) => {
		let queryData = {...req.query}
		try {
			const response = await axiosInstance.get(`/reset-password?email=${req.query.email}&confirmString=${req.query.confirmString}`)

			if (response.status === 204) {
				return res.render("templates/client/auth/auth.hbs", {
					auth: "reset-password",
					layout: "client/index.layout.hbs",
					csrfToken: req.csrfToken(),
					queryData: JSON.stringify(queryData)
				})
			}
		} catch (error) {
			if (error.response.status === 400) {
				return res.render("templates/client/auth/auth.hbs", {
					auth: "reset-password",
					layout: "client/index.layout.hbs",
					csrfToken: req.csrfToken(),
					queryData: JSON.stringify(queryData)
				})
			}
			return handleErrors(res, error, 'user')
		}
	},
	
  resetPassword: async (req, res, next) => {
		const queryData = JSON.parse(req.body.query)
    try {
      const response = await axiosInstance.put(
				`/reset-password?email=${queryData.email}&confirmString=${queryData.confirmString}`, 
				{...req.body}
      )

      if (response.status === 204) {
				req.flash('success', 'Your new password was set. You can now login.')
				return res.redirect('/login')
      }
    } catch (error) {
			if (error.response.status === 400) {
				req.flash('fail', 'Your input is not valid.')
				return res.render('templates/client/auth/auth.hbs', {
					auth: 'reset-password',
					layout: 'client/index.layout.hbs',
					csrfToken: req.csrfToken(),
					errors: handleInvalidationErrors(error.response.data.error.invalidation)
				})
			}
      return helper.handleErrors(res, error, "user")
    }
  },

  // @desc:   show login page
  // @route:  GET /login
  showLoginPage: (req, res) => {
    return res.render("templates/client/auth/auth.hbs", {
      auth: "login",
			layout: "client/index.layout.hbs",
			csrfToken: req.csrfToken()
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
        path: "/",
        httpOnly: true,
        secure: false,
        expires
      }
    )
    
    return next()
	},
	
}
