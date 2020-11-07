const axiosInstance = require('../../helper/axios.helper')
const helper = require("../../helper/helper")
const authHelper = require('../../helper/auth.helper')
const { renderServerErrorPage } = require('../../helper/helper')

module.exports = {
    // @desc:   Show profile
    // @route   GET /profile
    showProfilePage: async (req, res) => {
        try {
            const user = await authHelper.getUser({...req.user})
            user.profile = await authHelper.getProfile({...req.user})
            const tabpane = (req.query.tabpane != null) ? req.query.tabpane : 'account'
            
            return res.render("templates/admin/profile/profile", {
                layout: "admin/profile.layout.hbs",
                user: user,
                tabpane: tabpane,
                csrfToken: req.csrfToken(),
            })
        } catch (error) {
            return res.render("templates/admin/error/404", {
                layout: "admin/error.layout.hbs",
            })
        }
    },

    // @desc    Update profile
    // @route   POST /profile
    updateProfile: async (req, res) => {
        const user = {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            profile: await authHelper.getProfile({...req.user}),
            status: req.user.status,
            createdAt: req.user.createdAt,
        }

        try {
            //  Avatar has error
            if (res.locals.file && res.locals.file.error) {
                return res.render("templates/admin/profile/profile", {
                    layout: "admin/profile.layout.hbs",
                    user: user,
                    csrfToken: req.csrfToken(),
                    tabpane: 'profile',
                    error: res.locals.file.error
                })
            }

            let updateData = helper.removeCSRF(req.body)
            if (updateData.dateOfBirth != null){
                updateData.dateOfBirth = helper.toDateFormat(req.body.dateOfBirth.toString())
            }
            if (req.files.avatar != null) {
                updateData.avatar = req.files.avatar[0].buffer
            }
            
            const response = await axiosInstance.put(
                "/profile",
                updateData,
                {
                    headers: { 
                        Authorization: "Bearer " + req.user.accessToken,
                    }
                },
            )

            if (response.status === 204) {
                req.flash('success', 'Your profile was updated.')
                return res.redirect("/admin/profile?tabpane=profile")
            }

        } catch (error) {
            if (error.response && error.response.status >= 400) {
                if (error.response.data.error.name === 'ValidationError') {
                    req.flash('fail', 'Failed to update.')
                    return res.render("templates/admin/profile/profile", {
                        layout: "admin/profile.layout.hbs",
                        user: user,
                        csrfToken: req.csrfToken(),
                        tabpane: 'profile',
                        error: error.response.data.error
                    })
                }
            }
            
            return helper.renderServerErrorPage(res, 'admin')
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
