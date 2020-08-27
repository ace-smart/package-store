module.exports = {
    // @desc:   Show providers
    // @route   GET /providers
    showProviderList: async (req, res) => {
        res.render('templates/admin/provider',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get providers by Id
    // @route   GET /providers/:id
    getProviderById: async (req, res) => {
        // res.render('templates/admin/provider',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /providers/add
    showCreateProviderForm: async (req, res) => {
        res.render('templates/admin/provider_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update provider
    // @route   PUT /providers/:id
    updateProviderById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete provider
    // @route   DELETE /providers/:id
    removeProviderById: async (req, res) => {
        return 'Remove'
    },
}
