const axios = require("axios")
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api`,
    timeout: 10000,
    // headers: {'Content-Type': 'application/json'}
})

module.exports = {
    // @desc:   show login form
    // @route:  GET /login
    showLoginForm: (req, res) => {
        res.render('templates/admin/auth/login', {
            layout: 'admin/auth.layout.hbs',
            csrfToken: req.csrfToken()
        })  
    },

    // @desc:   authenticate user
    // @route:  GET /login
    login: async (req, res) => {
        console.log(req.body)
        const user = {
            username: req.body.username,
            password: req.body.password
        }

        try {
            const response = await axiosInstance.post(
                "/auth",
                {
                    username: "root",
                    password: "1234",
                },
                {
                    responseType: "json",
                    responseEncoding: "utf-8",
                }
            )
            if (response.status === 200 && response.statusText === "OK") {
                if (response.data.success != null && response.data.success == true) {
                    
                    return {
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    }
                } else {
                    return {
                        error: response.data.message || "Failed",
                    }
                }
            }

            throw new Error("Authenticated failed.")
        } catch (error) {
            throw new Error(error)
        }
    },
}
