module.exports = {
    // @desc:   Show vouchers
    // @route   GET /vouchers
    showVoucherList: async (req, res) => {
        res.render('templates/admin/voucher',{
            layout: 'admin/table.layout.hbs'
        })
    },

    // @desc:   Get vouchers by Id
    // @route   GET /vouchers/:id
    getVoucherById: async (req, res) => {
        // res.render('templates/admin/voucher',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /vouchers/add
    showCreateVoucherForm: async (req, res) => {
        res.render('templates/admin/voucher_form',{
            layout: 'admin/form.layout.hbs'
        })
    },

    // @desc    Update voucher
    // @route   PUT /vouchers/:id
    updateVoucherById: async (req, res) => {
        return 'Update'
    },

    // @desc    Delete voucher
    // @route   DELETE /vouchers/:id
    removeVoucherById: async (req, res) => {
        return 'Remove'
    },
}
