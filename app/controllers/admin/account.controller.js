const axiosInstance = require("../../helper/axios.helper")
const helper = require("../../helper/helper")
const fs = require('fs')
const getAccountById = async function (accessToken, userId) {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`, {
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
const getUserData = function (reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody))
  return {
    username: reqBody.username,
    email: reqBody.email,
    password: reqBody.password,
    confirm_password: reqBody.confirm_password,
    status: reqBody.status,
    role: reqBody.role,
    profile: {
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      dateOfBirth: (reqBody.dateOfBirth != '') ? helper.toDateFormat(reqBody.dateOfBirth) : '',
      gender: (reqBody.gender == '') ? 'male' : reqBody.gender ,
      phoneNumber: reqBody.phoneNumber,
    },
  }
}
module.exports = {
  // @desc:   Show all accounts
  // @route   GET /accounts
  showAccountList: async (req, res) => {
    try {
      const response = await axiosInstance.get("/admin/users", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of accounts",
          route: "accounts",
          accounts: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   Show list of administrators
  // @route   GET /accounts/admins
  showAdminList: async (req, res) => {
    try {
      const response = await axiosInstance.get("/admin/users/admins", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of administrators",
          route: "accounts",
          accounts: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   Show list of administrators
  // @route   GET /accounts/customers
  showCustomerList: async (req, res) => {
    try {
      const response = await axiosInstance.get("/admin/users/customers", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of Customers",
          route: "accounts",
          accounts: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   View a user information
  // @route   GET /accounts/view/:id
  viewUserById: async (req, res) => {
    try {
      const account = await getAccountById(req.user.accessToken, req.params.id)
      
      if(account.profile != null && account.profile.avatar.fileName != 'default') {
        account.profile.avatar.data = fs.readFileSync(`tmp\\avatar\\${account.profile.avatar.fileName}`)
      }

      if (account) {
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          header: "User information",
          route: "accounts",
          account: account,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    show create form
  // @route   GET /accounts/add
  showCreateUserForm: async (req, res) => {
    return res.render("templates/admin/account/account.hbs", {
      layout: "admin/main.layout.hbs",
      content: "form",
      formType: "create",
      header: "Add a new account",
      route: "accounts",
      user: await helper.getUserInstance(req),
      csrfToken: req.csrfToken(),
    })
  },

  // @desc    create admin
  // @route   POST /accounts/add
  createUser: async (req, res) => {
    let accountData = getUserData(req.body)
    try {
      const response = await axiosInstance.post("/admin/users", accountData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 201) {
        req.flash("success", "You have created a new account.")
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new account",
          route: "accounts",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, accountData)

        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new account",
          route: "accounts",
          csrfToken: req.csrfToken(),
          user: await helper.getUserInstance(req),
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
        })
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    show create form
  // @route   GET /accounts/edit/:id
  showEditUserForm: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })
      
      if (response.status === 200) {
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update account",
          route: "accounts",
          user: await helper.getUserInstance(req),
          account: response.data,
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Edit account
  // @route   POST /accounts/edit/:id
  editUserById: async (req, res) => {
    let accountData = {}
    try {
      const account = await getAccountById(req.user.accessToken, req.params.id)

      if (account) {
        accountData = helper.getFilledFields(getUserData(req.body), account)
      }
      
      const updateResponse = await axiosInstance.put(
        `/admin/users/${req.params.id}`,
        accountData,
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (updateResponse.status === 204) {
        req.flash("success", "Your changes have been saved.")
        return res.render("templates/admin/account/account.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update account",
          route: "accounts",
          user: await helper.getUserInstance(req),
          account: await getAccountById(req.user.accessToken, req.params.id),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)
        
        if (error.response && error.response.status === 400) {
          req.flash("fail", "Your changes was not valid. Please check your input.")
          return res.render("templates/admin/account/account.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "update",
            header: "Update account",
            route: "accounts",
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken(),
            account: await getAccountById(req.user.accessToken, req.params.id),
            errors: helper.handleInvalidationErrors(errors),
            validData: validData,
          })
        }
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate an account by Id
  // @route   PUT /accounts/deactivate/:id
  deactivateUserById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/users/${req.params.id}`,
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

  // @desc    Update administrator
  // @route   PUT /accounts/activate/:id
  activateUserById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/users/${req.params.id}`,
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

  // @desc    Update administrator
  // @route   PUT /accounts/reset-password/:id
  resetPassword: async (req, res) => {
    /**
     *  req.body {
     *      email: 'example@email.com'
     *  }
     */
    try {
      const response = await axiosInstance.post(
        `/reset-password`,
        {
          email: req.body.email,
        },
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (response.status === 200) {
        return res.sendStatus(200)
      }
    } catch (error) {
      if (error.response.status === 400) {
        return res.status(400).json(error.response.data.error.message)
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete administrator
  // @route   DELETE /accounts/delete/:id
  removeUserById: async (req, res) => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${req.params.id}`, {
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
