module.exports = {
    // @desc:   Show categories
    // @route   GET /categories
    showCategoryList: async (req, res) => {
        res.render('templates/admin/category',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get category by Id
    // @route   GET /categories/:id
    getCategoryById: async (req, res) => {
        // res.render('templates/admin/category',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create category form
    // @route   GET /categories/add
    showCreateCategoryForm: async (req, res) => {
        res.render('templates/admin/category_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update category
    // @route   PUT /categories/:id
    updateCategoryById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete category
    // @route   DELETE /categories/:id
    removeCategoryById: async (req, res) => {
        return 'Remove'
    },
}
