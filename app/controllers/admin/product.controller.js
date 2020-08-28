module.exports = {
    // @desc:   Show products
    // @route   GET /products
    showProductList: async (req, res) => {
        res.render('templates/admin/account',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get products by Id
    // @route   GET /products/:id
    getProductById: async (req, res) => {
        // res.render('templates/admin/account',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create product form
    // @route   GET /products/add
    showCreateProductForm: async (req, res) => {
        res.render('templates/admin/account_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update product
    // @route   PUT /products/:id
    updateProductById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete product
    // @route   DELETE /products/:id
    removeProductById: async (req, res) => {
        return 'Remove'
    },
}
