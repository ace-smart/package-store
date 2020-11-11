const axiosInstance = require('../../helper/axios.helper')
const helper = require('../../helper/helper')
const authHelper = require('../../helper/auth.helper')

module.exports = {
    // @desc:   Show all users
    // @route   GET /users
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
                    accounts: response.data,
                    user: await helper.getUserInstance(req),
                    csrfToken: req.csrfToken(),
                })
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
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
                    accounts: response.data,
                    user: await helper.getUserInstance(req),
                    csrfToken: req.csrfToken(),
                })
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
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
                    accounts: response.data,
                    user: await helper.getUserInstance(req),
                    csrfToken: req.csrfToken(),
                })
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc:   View a user information
    // @route   GET /accounts/view/:id
    viewUserById: async (req, res) => {
        try {
            const response = await axiosInstance.get(
                `/admin/users/${req.params.id}`,
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })

            
            if (response.status === 200) {
                const account = response.data
                if (account.profileId != null) {
                    try {
                        const profileRes = await axiosInstance.get(
                            `/profile/${account.profileId}`,
                            {
                                headers: {
                                    Authorization: "Bearer " + req.user.accessToken,
                                },
                            })
                        
                        if (profileRes.status === 200) {
                            account.profile = profileRes.data
                        }
                    } catch (error) {
                        throw error
                    }
                }

                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "view",
                    header: "User information",
                    account: account,
                    user: await helper.getUserInstance(req),
                    csrfToken: req.csrfToken(),
                })
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc    show create form
    // @route   GET /accounts/add
    showCreateUserForm: async (req, res) => {
        return res.render("templates/admin/account/account.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "create",
            header: "Add a new administrator",
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken(),
        })
    },

    // @desc    create admin
    // @route   POST /accounts/add
    createUser: async (req, res) => {
        let accountData = require("../../helper/helper").removeCSRF(req.body)
        try {
            const response = await axiosInstance.post("/admin/users", accountData, {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 201) {
                req.flash("success", "Successfully! You have created a new account.")
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "create",
                    header: "Add a new administrator",
                    user: await helper.getUserInstance(req),
                    csrfToken: req.csrfToken(),
                })
            }

        } catch (error) {
            if (error.response.status === 400) {
                //ValidationError
                const errors = error.response.data.error.invalidation
                const inputFields = Object.keys(accountData)
                for(let i = 0; i < inputFields.length; i++) {
                    const isFound = errors.find((ele) => ele.field === inputFields[i])
                    if (isFound) {
                        delete accountData[inputFields[i]]
                    }
                }
                
                req.flash("fail", "Your input is not valid. Please check and then fill in again.")
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "create",
                    header: "Add a new administrator",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    errors: errors,
                    validData: JSON.parse(JSON.stringify(accountData))
                })
            }
            
            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc    show create form
    // @route   GET /accounts/edit/:id
    showEditUserForm: async (req, res) => {
        try {
            const response = await axiosInstance.get(
                `/admin/users/${req.params.id}`,
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })
            
            if (response.status === 200) {
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "update",
                    header: "Update the administrator",
                    user: await helper.getUserInstance(req),
                    account: response.data,
                    csrfToken: req.csrfToken(),
                })
            }
        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc    Edit account
    // @route   POST /accounts/edit/:id
    editUserById: async (req, res) => {
        try {
            const response = await axiosInstance.get(
                `/admin/users/${req.params.id}`,
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })

            if (response.status === 200) {
                const account = response.data
                let accountData = require("../../helper/helper").removeCSRF(req.body)
                accountData = require("../../helper/helper").getFilledFields(accountData, account)
                
                try {
                    const response = await axiosInstance.put(
                        `/admin/users/${req.params.id}`, 
                        accountData, 
                        {
                            headers: {
                                Authorization: "Bearer " + req.user.accessToken,
                            },
                        })

                    if (response.status === 204) {
                        req.flash("success", "Your changes have been saved.")
                        return res.render("templates/admin/account/account.hbs", {
                            layout: "admin/main.layout.hbs",
                            content: "form",
                            formType: "update",
                            header: "Update the administrator",
                            user: await helper.getUserInstance(req),
                            account: JSON.parse(JSON.stringify(req.body)),
                            csrfToken: req.csrfToken(),
                        })
                    }
                } catch (error) {
                    //ValidationError
                    const errors = error.response.data.error.invalidation
                    const inputFields = Object.keys(accountData)
                    for(let i = 0; i < inputFields.length; i++) {
                        const isFound = errors.find((ele) => ele.field === inputFields[i])
                        if (isFound) {
                            delete accountData[inputFields[i]]
                        }
                    }
                    if (error.response && error.response.status === 400) {
                        req.flash("fail", "Your changes was not valid. Please check your input.")
                        return res.render("templates/admin/account/account.hbs", {
                            layout: "admin/main.layout.hbs",
                            content: "form",
                            formType: "update",
                            header: "Update the administrator",
                            user: await helper.getUserInstance(req),
                            account: account,
                            csrfToken: req.csrfToken(),
                            errors: errors,
                            validData: accountData
                        })
                    } else {
                        throw error
                    }
                }
            }
        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
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
                })

            if (response.status === 204) {
                return res.sendStatus(200)
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
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
                })
            if (response.status === 204) {
                return res.sendStatus(200)
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
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
                })
            
            if (response.status === 200) {
                return res.sendStatus(200)
            }

        } catch (error) {
            if (error.response.status === 400) {
                return res.status(400).json(error.response.data.error.message)
            }

            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc    Delete administrator
    // @route   DELETE /accounts/delete/:id
    removeUserById: async (req, res) => {
        try {
            const response = await axiosInstance.delete(
                `/admin/users/${req.params.id}`,
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })
            if (response.status === 204) {
                return res.sendStatus(200)
            }

        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
        }
    },
}
