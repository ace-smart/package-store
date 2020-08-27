module.exports = {
    // @desc:   Show customers
    // @route   GET /customers
    showCustomerList: async (req, res) => {
        res.render('templates/admin/account',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get customers by Id
    // @route   GET /customers/:id
    getCustomerById: async (req, res) => {
        // res.render('templates/admin/account',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create customer form
    // @route   GET /customers/add
    showCreateCustomerForm: async (req, res) => {
        res.render('templates/admin/account_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update customer
    // @route   PUT /customers/:id
    updateCustomerById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete customer
    // @route   DELETE /customers/:id
    removeCustomerById: async (req, res) => {
        return 'Remove'
    },
}
