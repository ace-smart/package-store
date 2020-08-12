const Profile = require("../models/ProfileModel")
const validate_add_inp = require("../validation/create-profile")
const validate_update_inp = require("../validation/update-profile")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Get profile by Id
    // @route   GET /profile/:id
    getProfileById: async (req, res) => {
        try {
            const profile = await Profile.findOne({ _id: req.params.id }).lean()
            if (profile)
                return res.status(200).json({
                    success: true,
                    profile: profile,
                })
            // Not found
            return res.status(404).json({ success: false, message: "Not found" })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new profile
    // @route   POST /profile
    createNewProfile: async (req, res) => {
        try {
            const isValid = validate_add_inp({ ...req.body })
            if (isValid) {
                const newProfile = await Profile.create(sanitize.profile({ ...req.body }, "create"))

                return res.status(201).json({
                    success: true,
                    newProfile,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Update profile
    // @route   PUT /profile/:id
    updateProfileById: async (req, res) => {
        try {
            const profile = await Profile.findOne({ _id: req.params.id }).lean()
            if (profile) {
                const isValid = validate_update_inp({ ...req.body })
                if (isValid) {
                    await Profile.findOneAndUpdate(
                        { _id: req.params.id },
                        sanitize.profile({ ...req.body }, "update")
                    )
                    return res.sendStatus(204)
                }
            }

            return res.status(400).json({ success: false, message: "No profile found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete profile
    // @route   DELETE /profile/:id
    removeProfileById: async (req, res) => {
        try {
            const user = await Profile.findOneAndDelete({ _id: req.params.id })

            if (user) return res.sendStatus(204)

            return res.status(404).json({ success: false, message: "No user found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
