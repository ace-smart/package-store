const Provider = require("../models/ProviderModel")
const {validate_add_inp, validate_update_inp} = require("../validation/provider")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show providers
    // @route   GET /providers
    showProviderList: async (req, res) => {
        try {
            const providers = await Provider.find().lean()
            return res.status(200).json({ success: true, providers: providers })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   Get providers by Id
    // @route   GET /providers/:id
    getProviderById: async (req, res) => {
        try {
            const provider = await Provider.findOne({ _id: req.params.id }).lean()
            if (provider)
                return res.status(200).json({
                    success: true,
                    provider: provider,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No provider found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new category
    // @route   POST /providers
    createNewProvider: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newProvider = await Provider.create(
                    sanitize.provider({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    provider: newProvider,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update providers
    // @route   PUT /providers/:id
    updateProviderById: async (req, res) => {
        try {
            const provider = await Provider.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, provider._id)
            if (isValidInp) {
                await Provider.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.provider({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete providers
    // @route   DELETE /providers/:id
    removeProviderById: async (req, res) => {
        try {
            const provider = await Provider.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
