const axios = require('axios')
const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api/admin/users`,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    validateStatus: function (status) {
        return status < 500 // Resolve only if the status code is less than 500
    },
})
module.exports = {
    // @desc:   Show list of administrators
    // @route   GET /administrators
    showAdminList: async (req, res) => {
        try {
            const response = await axiosInstance.get(
                "/admins",
                {
                    responseType: "json",
                    responseEncoding: "utf-8",
                    headers: { 
                        Authorization: "Bearer " + req.user.accessToken,
                    }
                },
            )
            
            if (response.status === 200) {
                return res.render('templates/admin/account/admin/admin.hbs',{
                    layout: 'admin/main.layout.hbs',
                    content: 'list',
                    header: 'List of administrators',
                    admins: response.data.admins,
                    csrfToken: req.csrfToken(),
                })
            }

            if (response.status >= 400) {
                // Deny access
                return res.send("An error has occurred.")
            }
        } catch (error) {
            // Server return 500 with response
            if(error.response){
                return res.send(error.response.error)
            }else {
                // Not receive response
                console.log(error)
                return res.send("An error has occurred.")
            }
        }
    },

    // @desc:   Get administrators by Id
    // @route   GET /administrators/:id
    getAdminById: async (req, res) => {
        // res.render('templates/admin/account',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /administrators/add
    showCreateAdminForm: async (req, res) => {
        return res.render('templates/admin/account/admin/admin.hbs',{
            layout: 'admin/main.layout.hbs',
            content: 'form',
            header: 'Add a new administrator',
            breadcrumb: ''
        })
    },

    // @desc    create admin
    // @route   POST /administrators/add
    createAdmin: async (req, res) => {
        res.render('templates/admin/account_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update administrator
    // @route   PUT /administrators/:id
    updateAdminById: async (req, res) => {
        console.log(req.params.id)
        return res.send('removed')
    },

    // @desc    Update administrator
    // @route   PUT /administrators/:id
    activateAdmin: async (req, res) => {
        console.log(req.params.id)
        return res.send('removed')
    },

    // @desc    Update administrator
    // @route   PUT /administrators/reset_password/:id
    resetPassword: async (req, res) => {
        console.log(req.params.id)
        return res.send('removed')
    },

    // @desc    Delete administrator
    // @route   DELETE /administrators/:id
    removeAdminById: async (req, res) => {
        console.log(req.params.id)
        return res.send('removed')
    },
}
