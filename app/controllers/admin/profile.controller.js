const axios = require('axios')
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api/profile`,
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    validateStatus: function (status) {
        return status < 500 // Resolve only if the status code is less than 500
    },
})

module.exports = {
    // @desc:   Show profile
    // @route   GET /profile
    showProfilePage: async (req, res) => {
        try {
            const user = {
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                profile: req.user.profileId,
                status: req.user.status,
                createdAt: req.user.createdAt
            }

            return res.render("templates/admin/profile/profile", {
                layout: "admin/profile.layout.hbs",
                user: user,
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
            if (req.user.profileId != null) {
                // update profile
                console.log('update')
                console.log(req.files)
                console.log(req.file)
                return console.log(req.body)
                const response = await axiosInstance.put(
                    "/profile",
                    {
                        firstName: req.body.firstName.toLowerCase(),
                        lastName: req.body.lastName.toLowerCase(),
                        gender: req.body.gender.toLowerCase(),
                        dateOfBirth: req.body.dateOfBirth.toString(),
                        phoneNumber: req.body.phoneNumber.toString(),
                    },
                    {
                        responseType: "json",
                        responseEncoding: "utf-8",
                    }
                )
    
                if (response.status === 200 && response.statusText === "OK") {
                    if (response.data.success == true) {
                        if (response.data.user.role === role) return response.data.user
    
                        return { error: "Your account has no access to this  site." }
                    }
                }
    
                return {
                    error: response.data.message,
                }
            }else {
                // create profile
                console.log('create')
                return console.log(req.body)
            }
            
            return console.log(req.body)
        } catch (error) {
            
        }
    },

    // @desc    change password
    // @route   POST /profile/changePwd
    changePwd: async (req, res) => {
        try {
            if (req.user.profileId != null) {
                // update profile
                console.log('changPwd')
                return console.log(req.body)
                const response = await axiosInstance.put(
                    "/profile",
                    {
                        firstName: req.body.firstName.toLowerCase(),
                        lastName: req.body.lastName.toLowerCase(),
                        gender: req.body.gender.toLowerCase(),
                        dateOfBirth: req.body.dateOfBirth.toString(),
                        phoneNumber: req.body.phoneNumber.toString(),
                    },
                    {
                        responseType: "json",
                        responseEncoding: "utf-8",
                    }
                )
    
                if (response.status === 200 && response.statusText === "OK") {
                    if (response.data.success == true) {
                        if (response.data.user.role === role) return response.data.user
    
                        return { error: "Your account has no access to this  site." }
                    }
                }
    
                return {
                    error: response.data.message,
                }
            }else {
                // create profile
                console.log('create')
                return console.log(req.body)
            }
            
            return console.log(req.body)
        } catch (error) {
            
        }
    },
}
