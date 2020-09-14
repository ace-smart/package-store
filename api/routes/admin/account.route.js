const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, changePwd } = require('../../controllers/account.controller')

// @desc:   get profile by accessTK
// @route:  GET /account/profile
router.get('/profile', getProfile)

// @desc:   update profile by accessTK
// @route:  PUT /account/profile
router.put('/profile', updateProfile)

// @desc:   change password by accessTK
// @route:  PUT /account/changePwd
router.put('/changePwd', changePwd)


module.exports = router