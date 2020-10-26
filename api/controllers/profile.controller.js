const User = require("../models/UserModel")
const Profile = require("../models/ProfileModel")
const bcrypt = require("bcrypt")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")
const UserObject = require("../objects/UserObject")
const UserModel = require("../models/UserModel")
const ProfileObject = require("../objects/ProfileObject")
const ErrorObject = require("../objects/ErrorObject")
const ValidationError = require("../errors/validation")
const { profile } = require("../validation/sanitize")
const ChangePwdObject = require("../objects/ChangePwdObject")

module.exports = {

  // @desc:   get profile by accessTK
  // @route:  GET /profile
  getProfile: async (req, res) => {
    try {
      const profileId = await UserObject.getProfileIdById(req.user.id)
      const profile = await ProfileObject.getProfile(profileId)
      if (profile) {
        return res.status(200).json({ profile: profile })
      }

      throw new Error("Failed to get profile")
    } catch (error) {
      return res.status(500).json(ErrorObject.sendServerError())
    }
  },

  // @desc:   update profile by accessTK
  // @route:  PUT /profile
  updateProfile: async (req, res) => {
    /* === EXAMPLE ===
      req.body = {
        avatar: <File>,
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male',
        dateOfBirth: '1980/10/22',
        phoneNumber: '+84123412345'
      }
    */
    try {
      // get profileId by accessToken
      const profileId = await UserObject.getProfileIdById(req.user.id)
      console.log(profileId == null)
      const profileObject = new ProfileObject({...req.body})
      if (req.file != null) {
        profileObject.setAvatar = req.file.buffer.toString('base64')
      }
      if (profileId == null) {
        const createdProfile = await ProfileObject.create(req.user.id, profileObject)
        if (createdProfile) {
          return res.sendStatus(204)
        }
      } else {
        profileObject.id = profileId
        const updatedProfile = await profileObject.save()
        if (updatedProfile) {
          return res.sendStatus(204)
        }
      }

      throw new Error("Failed to update profile")
    } catch (error) {
      if (error instanceof ValidationError){
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        return res.status(500).json(ErrorObject.sendServerError())
      }
    }
  },

  // @desc    Change password
  // @route   PUT /profile/change-password
  changePasswordByUserId: async (req, res) => {
    // req.body = {password, new_password, confirm_new_password}
    try {
      const changePwdObject = new ChangePwdObject({ id: req.user.id, ...req.body })
      const validation = await changePwdObject.validate()
      if (validation instanceof ChangePwdObject) {
        const newPassword = await bcrypt.hash(req.body.new_password, await bcrypt.genSalt())
        const user = await UserObject.getOneUserBy({_id: req.user.id})
        if (user instanceof UserObject) {
          const isUpdated = await user.update({ password: newPassword })
          if (isUpdated instanceof UserObject) {
            return res.sendStatus(204)
          }
        }
      }

      throw new Error("Failed to change password.")
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorObject.sendInvalidInputError(error.validation))
      } else {
        console.log(error)
        return res.status(500).json(ErrorObject.sendServerError(error))
      }
    }
  },

  // @desc    Delete profile
  // @route   DELETE /profile/:id
  removeProfileById: async (req, res) => {
    try {
      const profileObject = new ProfileObject({_id: req.user.id})
      const isRemoved = await profileObject.remove()
      if (isRemoved) {
        return res.sendStatus(204)
      }

      throw new Error("Failed to remove profile.")
    } catch (error) {
      return res.status(500).json({ success: false, message: outputErrors(error) })
    }
  },
}
