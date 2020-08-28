module.exports = {
    // @desc:   Show orders
    // @route   GET /orders
    showOrderList: async (req, res) => {
        res.render('templates/admin/account',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get orders by Id
    // @route   GET /orders/:id
    getOrderById: async (req, res) => {
        // res.render('templates/admin/account',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create order form
    // @route   GET /orders/add
    showCreateOrderForm: async (req, res) => {
        res.render('templates/admin/account_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update order
    // @route   PUT /orders/:id
    updateOrderById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete order
    // @route   DELETE /orders/:id
    removeOrderById: async (req, res) => {
        return 'Remove'
    },
}
