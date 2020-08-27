module.exports = {
    // @desc:   Show restocks
    // @route   GET /restocks
    showRestockList: async (req, res) => {
        res.render('templates/admin/restock',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get restocks by Id
    // @route   GET /restocks/:id
    getRestockById: async (req, res) => {
        // res.render('templates/admin/restock',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /restocks/add
    showCreateRestockForm: async (req, res) => {
        res.render('templates/admin/restock_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update restock
    // @route   PUT /restocks/:id
    updateRestockById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete restock
    // @route   DELETE /restocks/:id
    removeRestockById: async (req, res) => {
        return 'Remove'
    },
}
