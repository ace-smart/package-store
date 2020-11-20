const axiosInstance = require("../../helper/axios.helper")
const { getFilledFields } = require("../../helper/helper")
const helper = require("../../helper/helper")
const getProviderById = async function (accessToken, providerId) {
  try {
    const response = await axiosInstance.get(`/admin/providers/${providerId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const getProviderData = function(reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody))
  return {
    name: reqBody.name,
    email: reqBody.email,
    status: reqBody.status,
    address: {
      street: reqBody.street,
      district: reqBody.district,
      city: reqBody.city,
      country: reqBody.country,
      postalCode: parseInt(reqBody.postalCode.toString())
    }
  }
}

module.exports = {
  // @desc:   Show providers
  // @route   GET /providers
  showProviderList: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/providers`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of providers",
          route: "providers",
          providers: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   Get providers by Id
  // @route   GET /providers/view/:id
  viewProviderById: async (req, res) => {
    try {
      const provider = await getProviderById(req.user.accessToken, req.params.id)

      if (provider) {
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          header: "Provider information",
          route: "providers",
          provider: provider,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    show create form
  // @route   GET /providers/add
  showCreateProviderForm: async (req, res) => {
    return res.render("templates/admin/provider/provider.hbs", {
      layout: "admin/main.layout.hbs",
      content: "form",
      formType: "create",
      header: "Add a new provider",
      route: "providers",
      user: await helper.getUserInstance(req),
      csrfToken: req.csrfToken(),
    })
  },

  // @desc    show create form
  // @route   POST /providers/add
  createProvider: async (req, res) => {
    let providerData = getProviderData(req.body)
    try {
      const response = await axiosInstance.post(`/admin/providers`, providerData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        req.flash("success", "You have created a new provider.")
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new provider",
          route: "providers",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken()
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)

        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new provider",
          route: "providers",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
        })
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    show create form
  // @route   GET /providers/edit/:id
  showUpdateProviderForm: async (req, res) => {
    try {
      const provider = await getProviderById(req.user.accessToken, req.params.id)

      if (provider) {
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update provider",
          route: "providers",
          provider: provider,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Update provider
  // @route   PUT /providers/edit/:id
  updateProviderById: async (req, res) => {
    let providerData = {}
    
    try {
      const provider = await getProviderById(req.user.accessToken, req.params.id)
      if (provider) {
        providerData = helper.getFilledFields(getProviderData(req.body),provider)
      }
      const response = await axiosInstance.put(`/admin/providers/${req.params.id}`, providerData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 204) {
        req.flash("success", "Your changes were successfully saved.")
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update provider",
          route: "providers",
          provider: await getProviderById(req.user.accessToken, req.params.id),
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken()
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)

        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/provider/provider.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update provider",
          route: "providers",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
          provider: providerData
        })
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Activate provider
  // @route   PUT /providers/activate/:id
  activateProviderById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/providers/${req.params.id}`,
        {
          status: "activated",
        },
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate provider
  // @route   PUT /providers/deactivate/:id
  deactivateProviderById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/providers/${req.params.id}`,
        {
          status: "deactivated",
        },
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete provider
  // @route   DELETE /providers/:id
  removeProviderById: async (req, res) => {
    try {
      const response = await axiosInstance.delete(`/admin/providers/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },
}
