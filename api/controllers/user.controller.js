const User = require("../models/UserModel")
const {validate_add_inp, validate_update_inp} = require("../validation/user")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Get list of users 
    // @route   GET /users
    showUserList: async (req, res) => {
        try {
            const selectFields = "username email status role createdAt profileId"
            const users = await User.find({}, selectFields).lean()
            return res.status(200).json({success:true, users: users})
        } catch (error) {
            return res.status(500).json({success: false, error: outputErrors(error.message)})
        }
    },

    // @desc:   Get list of administrators 
    // @route   GET /users/admins
    showAdminList: async (req, res) => {
        try {
            const selectFields = "username email status role createdAt profileId"
            const admins = await User.find({role: 'admin'}, selectFields).lean()
            return res.status(200).json({success:true, admins: admins})
        } catch (error) {
            return res.status(500).json({success: false, error: outputErrors(error.message)})
        }
    },

    // @desc:   Show users
    // @route   GET /users/customers
    showCustomerList: async (req, res) => {
        try {
            const selectFields = "username email status role createdAt profileId"
            const customers = await User.find({}, selectFields).lean()
            return res.status(200).json({success:true, customers: customers})
        } catch (error) {
            return res.status(500).json({success: false, error: outputErrors(error.message)})
        }
    },

    // @desc:   Get user by Id
    // @route   GET /users/:id
    getUserById: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id }).lean()
            if (user)
                return res.status(200).json({
                    success: true,
                    user: user,
                })
            // Not found
            return res.status(404).json({ success: false, message: "Not found" })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc    Add new user
    // @route   POST /users
    createNewUser: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newUser = await User.create(await sanitize.user({ ...req.body }, "create"))

                return res.status(201).json({
                    success: true,
                    user: newUser,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update user
    // @route   PUT /users/:id
    updateUserById: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id }).lean()
            if (user) {
                const isValidInp = await validate_update_inp({ ...req.body }, req.params.id)
                if (isValidInp) {
                    await User.findOneAndUpdate(
                        { _id: req.params.id },
                        await sanitize.user({ ...req.body }, "update")
                    )
                    return res.sendStatus(204)
                }
            }

            return res.status(404).json({ success: false, error: {message: "No user found." }})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update user
    // @route   PUT /users/:id
    resetPasswordById: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id }).lean()
            if (user) {
                const isValidInp = await validate_update_inp({ ...req.body }, req.params.id)
                if (isValidInp) {
                    await User.findOneAndUpdate(
                        { _id: req.params.id },
                        await sanitize.user({ ...req.body }, "update")
                    )
                    return res.sendStatus(204)
                }
            }

            return res.status(404).json({ success: false, error: {message: "No user found." }})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Delete user
    // @route   DELETE /users/:id
    removeUserById: async (req, res) => {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.id })

            if (user) return res.sendStatus(204)

            return res.status(404).json({ success: false, message: "No user found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
