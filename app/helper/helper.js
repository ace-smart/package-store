module.exports = helper = {
  removeCSRF: function (formInput = {}) {
    // remove field ['_csrf'] from the form body
    if (JSON.stringify(formInput) !== "{}" && formInput._csrf != null) {
      delete formInput._csrf
    }

    return formInput
  },

  getFilledFields: function (body, data) {
    // return only fields that are different from database
    const bodyKeys = Object.keys(body)
    const filledFields = {}
    for (const [key, value] of Object.entries(data)) {
      for (let i = 0; i < bodyKeys.length; i++) {
        if (key === bodyKeys[i] && value !== body[key]) {
          filledFields[key] = body[key]
        }
      }
    }

    return filledFields
  },

  toDateFormat: function (dateString) {
    // origin format: [MM/DD/YYYY]
    // parse to format [YYYY/MM/DD]
    const [month, day, year] = [...dateString.split("/")]
    return year + "/" + month + "/" + day
  },

  renderServerErrorPage: function (res, forRole = "user") {
    if (forRole === "user") {
      return res.render("templates/client/error/500", {
        layout: "admin/error.layout.hbs",
      })
    } else if (forRole === "admin") {
      return res.render("templates/admin/error/500", {
        layout: "admin/error.layout.hbs",
      })
    }
  },

  renderNotFoundPage: function (res, forRole = "user") {
    if (forRole === "user") {
      return res.render("templates/client/error/404", {
        layout: "admin/error.layout.hbs",
      })
    } else if (forRole === "admin") {
      return res.render("templates/admin/error/404", {
        layout: "admin/error.layout.hbs",
      })
    }
  },

  renderForbiddenPage: function (res, forRole = "user") {
    if (forRole === "user") {
      return res.render("templates/client/error/403", {
        layout: "admin/error.layout.hbs",
      })
    } else if (forRole === "admin") {
      return res.render("templates/admin/error/403", {
        layout: "admin/error.layout.hbs",
      })
    }
  },

  renderUnauthorizedPage: function (res, forRole = "user") {
    if (forRole === "user") {
      return res.render("templates/client/error/401", {
        layout: "admin/error.layout.hbs",
      })
    } else if (forRole === "admin") {
      return res.render("templates/admin/error/401", {
        layout: "admin/error.layout.hbs",
      })
    }
  },

  getUserInstance: async function (req) {
    const authHelper = require('./auth.helper.js')
    return {
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      profile: await authHelper.getProfile({...req.user}),
      status: req.user.status,
      createdAt: req.user.createdAt,
    }
  },

  handleInvalidationErrors: function(invalidation = []) {
    let errorObject = {}
    // Get fields that have errors
    invalidation.forEach((element) => {
      if (errorObject[element.field]) {
        errorObject[element.field].messages.push(element.message)
      } else {
        errorObject[element.field] = {
          value : (element.value) ? element.value : '',
          messages: [element.message]
        }
      }
    })

    return errorObject
  },

  handleErrors: async function(res, error, forRole = 'user') {
    // Opt out 'ValidationError' (code: 400)
    if (error.response.status === 403) {
      return helper.renderForbiddenPage(res, forRole)
    }

    if (error.response.status === 404) {
      return helper.renderNotFoundPage(res, forRole)
    }

    if (error.response.status === 500) {
      return helper.renderServerErrorPage(res, forRole)
    }
  }
}
