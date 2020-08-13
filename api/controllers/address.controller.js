const Address = require("../models/AddressModel")
const {validate_add_inp, validate_update_inp} = require("../validation/address")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show addresses
    // @route   GET /addresses
    showAddressList: async (req, res) => {
        try {
            // const selectFields = "_id name status creat"
            const addresses = await Address.find().lean()
            return res.status(200).json({ success: true, addresses: addresses })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc:   Get addresses by Id
    // @route   GET /addresses/:id
    getAddressById: async (req, res) => {
        try {
            const address = await Address.findOne({ _id: req.params.id }).lean()
            if (address)
                return res.status(200).json({
                    success: true,
                    address: address,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No category found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new address
    // @route   POST /addresses
    createNewAddress: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newAddress = await Address.create(
                    sanitize.address({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    address: newAddress,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update address
    // @route   PUT /addresses/:id
    updateAddressById: async (req, res) => {
        try {
            const address = await Address.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, address._id)
            if (isValidInp) {
                await Address.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.address({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete address
    // @route   DELETE /addresses/:id
    removeAddressById: async (req, res) => {
        try {
            const address = await Address.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
