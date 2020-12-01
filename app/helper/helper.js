module.exports = helper = {
  removeCSRF: function (formInput = {}) {
    // remove field ['_csrf'] from the form body
    if (JSON.stringify(formInput) !== "{}" && formInput._csrf != null) {
      delete formInput._csrf
    }

    return formInput
  },

  isSameDate: function (dateObject1, dateObject2) {
    dateObject1 = new Date(dateObject1)
    dateObject2 = new Date(dateObject2)
    const date1 = dateObject1.getDate()
    const month1 = dateObject1.getMonth()
    const year1 = dateObject1.getFullYear()

    const date2 = dateObject2.getDate()
    const month2 = dateObject2.getMonth()
    const year2 = dateObject2.getFullYear()
    if (date1 === date2 && month1 === month2 && year1 === year2) {
      return true
    }

    return false
  },

  getFilledFields: function (body, data) {
    // return only fields that are filled
    const bodyKeys = Object.keys(body)
    const dataKeys = Object.keys(data)
    const filledFields = {}
    let newFieldsFromBody = []
    // Check inserted data has the same property as data object
    if (JSON.stringify(bodyKeys) === JSON.stringify(dataKeys)) {
    } else {
      bodyKeys.forEach((element) => {
        if (!dataKeys.includes(element)) {
          newFieldsFromBody.push(element)
        }
      })
      // Add to filledFields
      if (newFieldsFromBody.length > 0) {
        newFieldsFromBody.forEach((element) => {
          if (body[element] != null) {
            filledFields[element] = body[element]
          }
        })
      }
    }

    for (let [key, value] of Object.entries(data)) {
      for (let i = 0; i < bodyKeys.length; i++) {
        if (body[bodyKeys[i]] != null) {
          if (key === "validUntil" || key === "dateOfBirth") {
            if (!helper.isSameDate(value, body[key])) {
              filledFields[key] = body[key]
            }
          } else if (key === bodyKeys[i]) {
            // Type: Object
            if (value instanceof Object && body[key] instanceof Object) {
              if (JSON.stringify(value) !== JSON.stringify(body[key])) {
                filledFields[key] = body[key]
              }
            } else if (value != body[key]) {
              filledFields[key] = body[key]
            }
          }
        }
      }
    }

    return filledFields
  },

  getValidFields: function (errors, data) {
    let dataObject = JSON.parse(JSON.stringify(data))
    let inputFields = Object.keys(data)

    for (let i = 0; i < inputFields.length; i++) {
      const isFound = errors.find((ele) => ele.field === inputFields[i])
      if (isFound) {
        delete dataObject[inputFields[i]]
      }
    }

    return dataObject
  },

  toDateFormat: function (dateString) {
    // origin format: [MM/DD/YYYY]
    // parse to format [YYYY/MM/DD]
    const [month, day, year] = [...dateString.split("/")]
    return year + "/" + month + "/" + day
  },

  formatPriceValue: (price) => {
    // INPUT: '$123,000.00'
    return parseFloat(price.replace(/\$|\,/g, ""))
  },

  renderServerErrorPage: function (res, forRole = "user") {
    if (forRole === "user") {
      return res.render("templates/client/error/500", {
        layout: "client/index.layout.hbs",
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
        layout: "client/index.layout.hbs",
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
        layout: "client/index.layout.hbs",
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
        layout: "client/index.layout.hbs",
      })
    } else if (forRole === "admin") {
      return res.render("templates/admin/error/401", {
        layout: "admin/error.layout.hbs",
      })
    }
  },

  getUserInstance: async function (req) {
    const authHelper = require("./auth.helper.js")
    return {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profileId != null ? await authHelper.getProfile({ ...req.user }) : null,
      status: req.user.status,
      createdAt: req.user.createdAt,
    }
  },

  handleInvalidationErrors: function (invalidation = []) {
    let errorObject = {}
    // Get fields that have errors
    invalidation.forEach((element) => {
      if (errorObject[element.field]) {
        errorObject[element.field].messages.push(element.message)
      } else {
        errorObject[element.field] = {
          value: element.value ? element.value : "",
          messages: [element.message],
        }
      }
    })

    return errorObject
  },

  handleErrors: async function (res, error, forRole = "user") {
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
  },

  makePagination: (items, itemPerPage = 1, currentPage = 1) => {
    if (!items || itemPerPage < 1 || currentPage < 1) {
      return null
    }

    const numOfPages = Math.ceil(items.length / itemPerPage)
    if (currentPage > numOfPages) {
      throw { response: { status: 404 } }
    }
    const fromIndex = itemPerPage * (currentPage - 1)

    return items.splice(fromIndex, itemPerPage)
  },
}
