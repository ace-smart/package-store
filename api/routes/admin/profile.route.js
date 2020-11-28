const express = require('express')
const router = express.Router()
const { getProfile, getProfileById,updateProfile, changePasswordByUserId } = require('../../controllers/profile.controller')
const {_getAvatar } = require('../../helper/file')
const {_ensureAccessToken, _ensureAdminRole} = require('../../helper/auth')
const addressRouter = require('./address.route')

// @desc:   get profile by accessTK
// @route:  GET /profile
router.get('/', getProfile)

// @desc:   get profile by Id
// @route:  GET /profile/:id
router.get('/:id', _ensureAccessToken, _ensureAdminRole, getProfileById)

// @desc:   update profile by accessTK 
// @route:  PUT /profile
router.put('/', _getAvatar, updateProfile)

// @desc:   change password by accessTK
// @route:  PUT /change-password
router.put('/change-password', changePasswordByUserId)

/*  === Address routes === */ 
router.use('/address', addressRouter)

module.exports = router