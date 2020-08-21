const Storage = require("../models/StorageModel")
const {validate_add_inp, validate_update_inp} = require("../validation/storage")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show storages
    // @route   GET /storages
    showStorageList: async (req, res) => {
        try {
            const storages = await Storage.find().lean()
            return res.status(200).json({ success: true, storages: storages })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   Get storages by Id
    // @route   GET /storages/:id
    getStorageById: async (req, res) => {
        try {
            const storage = await Storage.findOne({ _id: req.params.id }).lean()
            if (storage)
                return res.status(200).json({
                    success: true,
                    storage: storage,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No storage found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new storage
    // @route   POST /storages
    createNewStorage: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newStorage = await Storage.create(
                    sanitize.storage({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    storage: newStorage,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update storages
    // @route   PUT /storages/:id
    updateStorageById: async (req, res) => {
        try {
            const storage = await Storage.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, storage._id)
            if (isValidInp) {
                await Storage.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.storage({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete storages
    // @route   DELETE /storages/:id
    removeStorageById: async (req, res) => {
        try {
            const storage = await Storage.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
