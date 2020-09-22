const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, changePwd } = require('../../controllers/profile.controller')
const {_ensureAccessToken} = require('../../helper/auth')

// @desc:   get profile by accessTK
// @route:  GET /profile
router.get('/profile', _ensureAccessToken, getProfile)

// @desc:   update profile by accessTK
// @route:  PUT /profile
router.put('/profile', _ensureAccessToken, updateProfile)

// @desc:   change password by accessTK
// @route:  PUT /changePwd
router.put('/changePwd', _ensureAccessToken, changePwd)

module.exports = router