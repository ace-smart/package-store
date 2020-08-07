const User = require("../../models/UserModel")
const bcrypt = require("bcrypt")
const userValidation = require("../validation/user.validation")
const authHelper = require("../helper/auth")

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
                return res.status(200).json({
                    username: user.username,
                    email: user.email,
                    status: user.status,
                })
            // Not found
            return res.status(404).json({ error: "Not found" })
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    // @desc    Add new user
    // @route   POST /users
    createNewUser: async (req, res) => {
        try {
            const errors = await userValidation.create(req.body)
            if (errors) return res.status(400).json({ errors: errors })

            // Valid input
            const newUser = await User.create({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(12)),
                role: "user",
            })

            if (newUser)
                return res.status(201).json({
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    status: newUser.status,
                })

            return res.status(500).json({ error: "Server error" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    // @desc    Update user
    // @route   PUT /users/:id
    updateUserById: async (req, res) => {
        try {
            let user = await User.findOne({ _id: req.params.id })

            if (user) {
                const errors = await userValidation.update(req.body, req.params.id)
                if (errors) return res.status(400).json({ errors: errors })

                // Check given property
                user.username =
                    typeof req.body.username !== "undefined" ? req.body.username : user.username
                user.email = typeof req.body.email !== "undefined" ? req.body.email : user.email
                user.password =
                    typeof req.body.password !== "undefined"
                        ? await bcrypt.hash(req.body.password, await bcrypt.genSalt(12))
                        : user.password

                const updated = await user.save()
                if (updated) return res.sendStatus(204)

                // Update failed
                return res.status(500).json({ error: "Server error" })
            }

            return res.status(404).json({ error: "Can not find the user" })
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    // @desc    Delete user
    // @route   DELETE /users/:id
    removeUserById: async (req, res) => {
        try {
            let user = await User.findOneAndDelete({ _id: req.params.id })

            if (user) return res.sendStatus(204)

            return res.status(404).json({ error: "Can not find the user" })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
}
