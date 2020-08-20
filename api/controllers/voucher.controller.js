const Voucher = require("../models/VoucherModel")
const {validate_add_inp, validate_update_inp} = require("../validation/voucher")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show vouchers
    // @route   GET /vouchers
    showVoucherList: async (req, res) => {
        try {
            const vouchers = await Voucher.find().lean()
            return res.status(200).json({ success: true, vouchers: vouchers })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc:   Get vouchers by Id
    // @route   GET /vouchers/:id
    getVoucherById: async (req, res) => {
        try {
            const voucher = await Voucher.findOne({ _id: req.params.id }).lean()
            if (voucher)
                return res.status(200).json({
                    success: true,
                    voucher: voucher,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No voucher found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new voucher
    // @route   POST /vouchers
    createNewVoucher: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newVoucher = await Voucher.create(
                    sanitize.voucher({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    voucher: newVoucher,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update voucher
    // @route   PUT /vouchers/:id
    updateVoucherById: async (req, res) => {
        try {
            const voucher = await Voucher.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, voucher._id)
            if (isValidInp) {
                await Voucher.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.voucher({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete voucher
    // @route   DELETE /vouchers/:id
    removeVoucherById: async (req, res) => {
        try {
            const voucher = await Voucher.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
