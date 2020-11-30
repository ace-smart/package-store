const { getUserInstance, handleErrors } = require("../../helper/helper")
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
    })
  },

  // @desc:   show about page
  // @route:  GET /contact
  showAboutPage: (req, res) => {
    return res.render("templates/client/index/index.hbs", {
      layout: "client/index.layout.hbs",
    })
  },
}
