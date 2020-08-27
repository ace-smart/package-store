module.exports = {
    // @desc:   Show administrators
    // @route   GET /administrators
    showAdminList: async (req, res) => {
        res.render('templates/admin/account',{
            layout: 'admin/table.layout.hbs'
        })
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
        res.render('templates/admin/account_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update administrator
    // @route   PUT /administrators/:id
    updateAdminById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete administrator
    // @route   DELETE /administrators/:id
    removeAdminById: async (req, res) => {
        return 'Remove'
    },
}
