const axios = require("axios")
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api`,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    validateStatus: function (status) {
        return status < 500 // Resolve only if the status code is less than 500
    },
})
const {toDateFormat} = require('../../helper/helper')

module.exports = {
    // @desc:   Show profile
    // @route   GET /profile
    showProfilePage: async (req, res) => {
        try {
            const tabpane = (req.query.tabpane != null) ? req.query.tabpane : 'account'

            return res.render("templates/admin/profile/profile", {
                layout: "admin/profile.layout.hbs",
                user: {
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    profile: req.user.profileId,
                    status: req.user.status,
                    createdAt: req.user.createdAt,
                },
                tabpane: tabpane,
                csrfToken: req.csrfToken(),
            })
        } catch (error) {
            return res.render("templates/admin/error/404", {
                layout: "admin/auth.layout.hbs",
            })
        }
    },

    // @desc    Update profile
    // @route   POST /profile
    updateProfile: async (req, res) => {
        try {
            let updateData = {...req.body}
            delete updateData._csrf
            if (updateData.dateOfBirth != null)
                updateData.dateOfBirth = toDateFormat(req.body.dateOfBirth.toString())
            if (req.files.avatar != null) 
                updateData.avatar = req.files.avatar[0].buffer
            
            const response = await axiosInstance.put(
                "/profile",
                updateData,
                {
                    responseType: "json",
                    responseEncoding: "utf-8",
                    headers: { 
                        Authorization: "Bearer " + req.user.accessToken,
                    }
                },
            )

            if (response.status === 204) {
                await require('../../helper/auth.helper').getUser({...req.user})
                req.flash('success', 'Your profile was updated.')
                return res.redirect("/admin/profile?tabpane=profile")
            }

            if (response.status >= 400) {
                // Deny access
                req.flash('fail', 'An error has occurred.')
                return res.send("error")
            }
        } catch (error) {
            // Server return 500 with response
            if(error.response){
                if (error.response.data.error.type === 'InvalidInput' || error.response.data.error.type === 'UnknownInput'){
                    return res.render("templates/admin/profile/profile", {
                        layout: "admin/profile.layout.hbs",
                        user: {
                            username: req.user.username,
                            email: req.user.email,
                            role: req.user.role,
                            profile: req.user.profileId,
                            status: req.user.status,
                            createdAt: req.user.createdAt,
                        },
                        csrfToken: req.csrfToken(),
                        tabpane: 'profile',
                        error: error.response.data.error
                    })
                }
                if (error.response.data.error.type === 'AvatarError' ){
                    return res.render("templates/admin/profile/profile", {
                        layout: "admin/profile.layout.hbs",
                        user: {
                            username: req.user.username,
                            email: req.user.email,
                            role: req.user.role,
                            profile: req.user.profileId,
                            status: req.user.status,
                            createdAt: req.user.createdAt,
                        },
                        csrfToken: req.csrfToken(),
                        tabpane: 'profile',
                        error: error.response.data.error
                    })
                }
            }else {
                // Not receive response
                req.flash('fail', 'An error has occurred.')
                console.log(error)
                return res.send("error")
            }
        }
    },

    // @desc:   Change password
    // @route   GET /changePwd
    showChangePwdPage: (req,res) => {
        return res.redirect('/admin/profile?tabpane=changePwd')
    },

    // @desc    change password
    // @route   POST /changePwd
    changePwd: async (req, res) => {
        // form inputs [currentPassword, newPassword]
        try {
            const formData = require('../../helper/helper').removeCSRF(req.body)
            const response = await axiosInstance.put(
                "/changePwd",
                {...formData}, 
                {
                    responseType: "json",
                    responseEncoding: "utf-8",
                    headers: { 
                        Authorization: "Bearer " + req.user.accessToken,
                    }
                }
            )

            if (response.status === 204) {
                await require('../../helper/auth.helper').getUser({...req.user})
                req.flash('success', 'Your password was changed.')
                return res.redirect("/admin/profile?tabpane=changePwd")
            }

        } catch (error) {
            // Server return 500 with response
            if(error.response){
                if (error.response.data.error.type === 'InvalidInput' || error.response.data.error.type === 'UnknownInput' || error.response.data.error.type === 'InvalidCredentials'){
                    return res.render("templates/admin/profile/profile", {
                        layout: "admin/profile.layout.hbs",
                        user: {
                            username: req.user.username,
                            email: req.user.email,
                            role: req.user.role,
                            profile: req.user.profileId,
                            status: req.user.status,
                            createdAt: req.user.createdAt,
                        },
                        csrfToken: req.csrfToken(),
                        tabpane: 'changePwd',
                        error: error.response.data.error
                    })
                }
            }else {
                // Not receive response
                return res.send("An error has occurred.")
            }
        }
    },
}
