module.exports = {
    // @desc:   Show storages
    // @route   GET /storages
    showStorageList: async (req, res) => {
        res.render('templates/admin/storage',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get storages by Id
    // @route   GET /storages/:id
    getStorageById: async (req, res) => {
        // res.render('templates/admin/storage',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /storages/add
    showCreateStorageForm: async (req, res) => {
        res.render('templates/admin/storage_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update storage
    // @route   PUT /storages/:id
    updateStorageById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete storage
    // @route   DELETE /storages/:id
    removeStorageById: async (req, res) => {
        return 'Remove'
    },
}
