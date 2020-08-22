const Restock = require("../models/RestockModel")
const {validate_add_inp, validate_update_inp} = require("../validation/restock")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show restock
    // @route   GET /restock
    showRestockList: async (req, res) => {
        try {
            const restock = await Restock.find().lean()
            return res.status(200).json({ success: true, restock: restock })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   Get restock by Id
    // @route   GET /restock/:id
    getRestockById: async (req, res) => {
        try {
            const restock = await Restock.findOne({ _id: req.params.id }).lean()
            if (provider)
                return res.status(200).json({
                    success: true,
                    restock: restock,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No restock found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new restock
    // @route   POST /restock
    createNewRestock: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newRestock = await Restock.create(
                    sanitize.restock({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    restock: newRestock,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update restock
    // @route   PUT /restock/:id
    updateRestockById: async (req, res) => {
        try {
            const restock = await Restock.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, restock._id)
            if (isValidInp) {
                await Restock.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.restock({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete restock
    // @route   DELETE /restock/:id
    removeRestockById: async (req, res) => {
        try {
            const restock = await Restock.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
