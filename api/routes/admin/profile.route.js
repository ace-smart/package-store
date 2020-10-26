const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, changePasswordByUserId } = require('../../controllers/profile.controller')
const {_getAvatar } = require('../../helper/file')

// @desc:   get profile by accessTK
// @route:  GET /profile
router.get('/', getProfile)

// @desc:   update profile by accessTK
// @route:  PUT /profile
router.put('/', _getAvatar, updateProfile)

// @desc:   change password by accessTK
// @route:  PUT /change-password
router.put('/change-password', changePasswordByUserId)

module.exports = router