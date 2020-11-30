const axiosInstance = require("../../helper/axios.helper")
const { getUserInstance, handleErrors, handleInvalidationErrors } = require("../../helper/helper")
module.exports = {
  // @desc:   show index page
  // @route:  GET ['/','/index','/home']
  showIndexPage: async (req, res) => {
    let user = null
    if (req.isAuthenticated()) {
        try {
            user = await getUserInstance(req)
        } catch (error) {
            user = null
        }
    }

    return res.render("templates/client/index/index.hbs", {
      layout: "client/index.layout.hbs",
      user: user
    })
  },

  // @desc:   show contact page
  // @route:  GET /contact
  showContactPage: (req, res) => {
    return res.render("templates/client/contact/contact.hbs", {
      layout: "client/index.layout.hbs",
      template: "contact",
      csrfToken: req.csrfToken()
    })
  },

  // @desc:   Leave messages
  // @route:  POST /contact
  contact: async(req, res) => {
    try {
      const response = await axiosInstance.post(`/leave-message`, req.body)
      console.log(response)
      if(response.status === 201) {
        req.flash('success', 'Thank you for reaching out to us. Please wait for our response.')
        return res.redirect('/contact')
      }
    } catch (error) {
      if(error.response.status === 400) {
        req.flash('fail', 'Your input is not valid.')
        return res.render('templates/client/contact/contact.hbs', {
          layout: 'client/index.layout.hbs',
          template: "contact",
          csrfToken: req.csrfToken(),
          errors: handleInvalidationErrors(error.response.data.error.invalidation)
        })
      }
      return handleErrors(res, error, 'user')
    }
  },

  // @desc:   show about page
  // @route:  GET /contact
  showAboutPage: (req, res) => {
    return res.render("templates/client/index/index.hbs", {
      layout: "client/index.layout.hbs",
    })
  },
}
