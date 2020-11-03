const bcrypt = require("bcrypt")
const UserObject = require("../objects/UserObject")
const ProfileObject = require("../objects/ProfileObject")
const ChangePwdObject = require("../objects/ChangePwdObject")
const ErrorObject = require("../objects/ErrorObject")
const ValidationError = require("../errors/validation")
const NotFoundError = require('../errors/not_found')
const ErrorHandler = require('../helper/errorHandler')

module.exports = {

  // @desc:   get profile by accessTK
  // @route:  GET /profile
  getProfile: async (req, res) => {
    try {
      const profileId = await UserObject.getProfileIdById(req.user.id)
      if (profileId) {
        const profile = await ProfileObject.getProfile(profileId)
        if (profile) {
          return res.status(200).json(profile)
        }
      }
      
      throw new NotFoundError("No profile found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
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
      const profileObject = new ProfileObject({...req.body})
      if (req.file != null) {
        profileObject.setAvatar = req.file.buffer.toString('base64')
      }
      if (profileId == null) {
        // create as the 1st time
        const createdProfile = await ProfileObject.create(req.user.id, profileObject)
        if (createdProfile) {
          return res.sendStatus(204)
        }
      } else {
        // update
        profileObject.id = profileId
        const updatedProfile = await profileObject.update(req.user.id, profileObject)
        if (updatedProfile) {
          return res.sendStatus(204)
        }
      }

      throw new Error("Failed to update profile")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
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

          throw new Error("Failed to change password.")
        }

        throw new NotFoundError("No user found.")
      }

    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete profile
  // @route   DELETE /profile/:id
  removeProfileById: async (req, res) => {
    try {
      const profileObject = new ProfileObject({_id: req.user.id})
      if (profileObject) {
        const isRemoved = await profileObject.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }
  
        throw new Error("Failed to remove profile.")
      }

      throw new NotFoundError("No profile found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
