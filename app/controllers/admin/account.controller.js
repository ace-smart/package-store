const axios = require("axios")
const connectMongo = require("connect-mongo")
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api/admin/users`,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    validateStatus: function (status) {
        return status < 500 // Resolve only if the status code is less than 500
    },
})
const getUserById = async function (id, accessToken) {
    try {
        const response = await axiosInstance.get(`${id}`, {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        })
        
        if (response.status === 200 && response.data.success === true) {
            return response.data.user
        }

        return null
    } catch (error) {
        return null
    }
}

module.exports = {
    // @desc:   Show all users
    // @route   GET /users
    showAccountList: async (req, res) => {
        try {
            const response = await axiosInstance.get("/", {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 200) {
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "list",
                    header: "List of accounts",
                    accounts: response.data.users,
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                // Deny access
                return res.send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                return res.send(error.response.error)
            } else {
                // Not receive response
                console.log(error)
                return res.send("An error has occurred.")
            }
        }
    },

    // @desc:   Show list of administrators
    // @route   GET /accounts/admins
    showAdminList: async (req, res) => {
        try {
            const response = await axiosInstance.get("/admins", {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 200) {
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "list",
                    header: "List of administrators",
                    accounts: response.data.admins,
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                // Deny access
                return res.send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                return res.send(error.response.error)
            } else {
                // Not receive response
                console.log(error)
                return res.send("An error has occurred.")
            }
        }
    },

    // @desc:   Show list of administrators
    // @route   GET /accounts/customers
    showCustomerList: async (req, res) => {
        try {
            const response = await axiosInstance.get("/customers", {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 200) {
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "list",
                    header: "List of administrators",
                    accounts: response.data.customers,
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                // Deny access
                return res.send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                return res.send(error.response.error)
            } else {
                // Not receive response
                console.log(error)
                return res.send("An error has occurred.")
            }
        }
    },

    // @desc:   Get administrators by Id
    // @route   GET /accounts/:id
    getUserById: async (req, res) => {
        try {
            const response = await axiosInstance.get(`${req.params.id}`, {
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
                    user: response.data.user,
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                req.flash("fail", "An error has occurred.")
                return res.redirect("/admin/accounts")
            }
        } catch (error) {
            if (error.data) {
                res.send(error)
            }
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
            csrfToken: req.csrfToken(),
        })
    },

    // @desc    create admin
    // @route   POST /accounts/add
    createUser: async (req, res) => {
        let userData = require("../../helper/helper").removeCSRF(req.body)
        userData.status = req.body.status === "on" ? "activated" : "deactivated"

        try {
            const response = await axiosInstance.post("/", userData, {
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
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                // Deny access
                return res.send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                if (
                    error.response.data.error.type === "InvalidInput" ||
                    error.response.data.error.type === "UnknownInput"
                ) {
                    req.flash("fail", "Failed! Your input is invalid.")
                    return res.render("templates/admin/account/account.hbs", {
                        layout: "admin/main.layout.hbs",
                        content: "form",
                        formType: "create",
                        header: "Add a new administrator",
                        csrfToken: req.csrfToken(),
                        tabpane: "profile",
                        error: error.response.data.error,
                    })
                }
            } else {
                // Not receive response
                console.log(error)
                return res.send("An error has occurred.")
            }
        }
    },

    // @desc    show create form
    // @route   GET /accounts/edit/:id
    showEditUserForm: async (req, res) => {
        const user = await getUserById(req.params.id, req.user.accessToken)
        if (user != null) {
            return res.render("templates/admin/account/account.hbs", {
                layout: "admin/main.layout.hbs",
                content: "form",
                formType: "update",
                header: "Update the administrator",
                user: user,
                csrfToken: req.csrfToken(),
            })
        }

        return res.send("error")
        try {
            const response = await axiosInstance.get(`${req.params.id}`, {
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
                    user: response.data.user,
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                req.flash("fail", "An error has occurred.")
                return res.redirect("/admin/accounts")
            }
        } catch (error) {
            if (error.data) {
                res.send(error)
            }
        }
    },

    // @desc    Edit account
    // @route   POST /accounts/edit/:id
    editUserById: async (req, res) => {
        const user = await getUserById(req.params.id, req.user.accessToken)
        let userData = require("../../helper/helper").removeCSRF(req.body)
        userData.status = (req.body.status === "on") ? "activated" : "deactivated"
        userData = require("../../helper/helper").getFilledFields(userData, user)
        try {
            const response = await axiosInstance.put(
                `${req.params.id}`, 
                userData, 
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })

            if (response.status === 204) {
                req.flash("success", "Your changes were saved.")
                return res.render("templates/admin/account/account.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "update",
                    header: "Update the administrator",
                    user: await getUserById(req.params.id, req.user.accessToken),
                    csrfToken: req.csrfToken(),
                })
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                console.log(error.response.data)
                if (
                    error.response.data.error.type === "InvalidInput" ||
                    error.response.data.error.type === "UnknownInput"
                ) {
                    req.flash("fail", "Your input is not valid.")
                    return res.render("templates/admin/account/account.hbs", {
                        layout: "admin/main.layout.hbs",
                        content: "form",
                        formType: "update",
                        header: "Update the administrator",
                        user: user,
                        csrfToken: req.csrfToken(),
                        error: error.response.data.error,
                    })
                }
            } else {
                // Not receive response
                console.log(error)
                return res.send("An error has occurred.")
            }
        }
    },

    // @desc    Deactivate an account by Id
    // @route   PUT /accounts/deactivate/:id
    deactivateUserById: async (req, res) => {
        try {
            const response = await axiosInstance.put(
                `${req.params.id}`,
                {
                    status: "deactivated",
                }, 
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })
            if (response.status === 204) {
                return res.status(200).send("Done")
            }

            if (response.status >= 400) {
                // Deny access
                return res.status(400).send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                return res.status(500).send(error.response.error)
            } else {
                // Not receive response
                console.log(error)
                return res.status(500).send("An error has occurred.")
            }
        }
    },

    // @desc    Update administrator
    // @route   PUT /accounts/activate/:id
    activateUserById: async (req, res) => {
        try {
            const response = await axiosInstance.put(
                `${req.params.id}`,
                {
                    status: "activated",
                }, 
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })
            if (response.status === 204) {
                return res.status(200).send("Done")
            }

            if (response.status >= 400) {
                // Deny access
                return res.status(400).send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                return res.status(500).send(error.response.error)
            } else {
                // Not receive response
                console.log(error)
                return res.status(500).send("An error has occurred.")
            }
        }
    },

    // @desc    Update administrator
    // @route   PUT /accounts/reset_password/:id
    resetPassword: async (req, res) => {
        console.log(req.params.id)
        return res.send("reset password")
    },

    // @desc    Delete administrator
    // @route   DELETE /accounts/delete/:id
    removeUserById: async (req, res) => {
        try {
            const response = await axiosInstance.delete(
                `${req.params.id}`,
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                })
            if (response.status === 204) {
                return res.status(200).send("Done")
            }

            if (response.status >= 400) {
                // Deny access
                return res.status(400).send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if (error.response) {
                return res.status(500).send(error.response.error)
            } else {
                // Not receive response
                console.log(error)
                return res.status(500).send("An error has occurred.")
            }
        }
    },
}
