const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const userValidation = require("../validation/user.validation")

module.exports = {
    // @desc:   Show users
    // @route   GET /users
    showUserList: async (req, res) => {
        try {
            const selectFields = "username email status"
            const users = await User.find({}, selectFields).lean()
            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    // @desc:   Get user by Id
    // @route   GET /users/:id
    getUserById: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id }).lean()
            if (user)
                return res.status(200).json({success: true,
                user :{
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                }})
            // Not found
            return res.status(404).json({ success: false, error: "Not found" })
        } catch (error) {
            return res.status(500).json({success: false, error: error.message})
        }
    },

    // @desc    Add new user
    // @route   POST /users
    createNewUser: async (req, res) => {
        try {
            const errors = await userValidation.create({...req.body})
            if (errors) return res.status(400).json({ success: false, errors: errors })

            // Valid input
            const newUser = await User.create({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(12)),
                role: req.body.role || "user",
                status: req.body.status || "deactivated"
            })

            if (newUser)
                return res.status(201).json({success: true, user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role.toLowerCase(),
                    status: newUser.status.toLowerCase(),
                }})

            return res.status(500).json({ success: false, error: "Failed to create." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, error: error.message})
        }
    },

    // @desc    Update user
    // @route   PUT /users/:id
    updateUserById: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id }).lean()

            if (user) {
                const errors = await userValidation.update({...req.body}, req.params.id)
                if (errors) return res.status(400).json({ success: false, errors: errors })

                // Check { password, role, status } are given
                const newUsername = (typeof req.body.username !== "undefined") 
                    ? req.body.username.toLowerCase()
                    : user.username
                const newEmail = (typeof req.body.email !== "undefined") 
                    ? req.body.email.toLowerCase()
                    : user.email
                const newPassword = (typeof req.body.password !== "undefined") 
                    ? await bcrypt.hash(req.body.password, await bcrypt.genSalt(12))
                    : user.password
                const newRole = (typeof req.body.role !== "undefined") 
                    ? req.body.role.toLowerCase()
                    : user.role
                const newStatus = (typeof req.body.status !== "undefined") 
                    ? req.body.status.toLowerCase()
                    : user.status

                const updated = await User.findOneAndUpdate({_id: req.params.id},
                    {
                        username: newUsername,
                        email: newEmail,
                        password: newPassword,
                        role: newRole,
                        status: newStatus,
                        updatedAt: Date.now()
                    }, {new: true})
                if (updated) return res.sendStatus(204)

                // Update failed
                return res.status(500).json({ success: false, error: "Failed to update." })
            }

            return res.status(404).json({ success: false, error: "No user found." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, message: error.message})
        }
    },

    // @desc    Delete user
    // @route   DELETE /users/:id
    removeUserById: async (req, res) => {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.id })

            if (user) return res.sendStatus(204)

            return res.status(404).json({ success: false, error: "No user found." })
        } catch (error) {
            return res.status(500).json({success: false, message: error.message})
        }
    },

}
