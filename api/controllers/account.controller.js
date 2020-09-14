const User = require("../models/UserModel")
const Profile = require("../models/ProfileModel")
const bcrypt = require("bcrypt")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   get profile by accessTK
    // @route:  GET /profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findOne({ accessToken: req.user.accessToken })
                .populate({
                    path: "profileId",
                })
                .lean()

            if (user != null)
                return res.status(200).json({
                    success: true,
                    user: user,
                })

            return res.status(200).json({
                success: false,
                message: "No user found.",
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   update profile by accessTK
    // @route:  PUT /profile
    updateProfile: async (req, res) => {
        const { validate_add_inp, validate_update_inp } = require("../validation/profile")
        try {
            const user = await User.findOne({ _id: req.user.id }).select('profileId')
            if (user.profileId != null) {
                // update profile
                if (validate_update_inp({ ...req.body })) {
                    let profileData = sanitize.profile({ ...req.body }, "update")
                    await Profile.findOneAndUpdate({ _id: user.profileId }, profileData)
                    return res.sendStatus(204)
                }
            } else {
                // create profile
                if (validate_add_inp({ ...req.body })) {
                    let profileData = sanitize.profile({ ...req.body }, "create")
                    const profile = await Profile.create(profileData)
                    await User.findOneAndUpdate(
                        { accessToken: req.user.accessToken },
                        { profileId: profile._id }
                    )
                    return res.sendStatus(204)
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc:   change password by accessTK
    // @route:  PUT /changePwd
    changePwd: async (req, res) => {
        // req.body contains {currentPassword, newPassword}
        try {
            const user = await User.findById(req.user.id).lean()
            if (await bcrypt.compare(req.body.currentPassword, user.password)){
                await User.findOneAndUpdate(
                    { _id: req.user.id },
                    { password: await bcrypt.hash(req.body.newPassword, await bcrypt.genSalt()) }
                )
                return res.sendStatus(204)
            }else {
                return res.status(400).json({ success: false, error: "Current password is not correct." })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

}
