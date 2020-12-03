const axiosInstance = require("../../helper/axios.helper")
const { getUserInstance, handleErrors, handleInvalidationErrors } = require("../../helper/helper")
const getMenu = async () => {
  try {
    const response = await axiosInstance.get(`/get-menu`)
    
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  // @desc:   show index page
  // @route:  GET ['/','/index','/home']
  showIndexPage: async (req, res) => {
    let user = null

    if (req.isAuthenticated() && req.user.role === 'user') {
        try {
            user = await getUserInstance(req)
        } catch (error) {
            user = null
        }
    }


    return res.render("templates/client/index/index.hbs", {
      layout: "client/index.layout.hbs",
      user: user,
      categories: await getMenu()

    })
  },

  // @desc:   show contact page
  // @route:  GET /contact
  showContactPage: (req, res) => {
    return res.render("templates/client/contact/contact.hbs", {
      layout: "client/index.layout.hbs",
      template: "contact",
      csrfToken: req.csrfToken(),
      pageTitle: "Contact",
      breadcrumb: [
        {link: '/', routeName: 'Home'},
        {link: '/contact', routeName: 'Contact'}
      ]
    })
  },

  // @desc:   Leave messages
  // @route:  POST /contact
  contact: async(req, res) => {
    try {
      const response = await axiosInstance.post(`/leave-message`, req.body)
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

  // @desc:   show about page
  // @route:  GET /faqs
  showFAQsPage: (req, res) => {
    return res.render("templates/client/index/faq.hbs", {
      layout: "client/index.layout.hbs",
      pageTitle: "FAQ",
      breadcrumb: [
        {link: '/', routeName: 'Home'},
        {link: '/faqs', routeName: 'FAQs'}
      ]
    })
  },
}
