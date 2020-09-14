const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, changePwd } = require('../../controllers/profile.controller')

// @desc:   get profile by accessTK
// @route:  GET /profile
router.get('/profile', getProfile)

// @desc:   update profile by accessTK
// @route:  PUT /profile
router.put('/profile', updateProfile)

// @desc:   change password by accessTK
// @route:  PUT /changePwd
router.put('/changePwd', changePwd)

module.exports = router