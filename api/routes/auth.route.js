const express = require('express')
const router = express.Router()
const { auth, renewAccessToken, getProfile, updateProfile, changePwd, logout } = require('../controllers/auth.controller')
const { _ensureAccessToken } = require('../helper/auth')

// @desc    Generate tokens
// @route   POST /auth
router.post('/auth', auth)

// @desc    Renew access token
// @route   GET /token
router.get('/token', renewAccessToken)

// @desc:   get profile by accessTK
// @route:  GET /profile
router.get('/profile', _ensureAccessToken, getProfile)

// @desc:   update profile by accessTK
// @route:  PUT /profile
router.put('/profile', _ensureAccessToken, updateProfile)

// @desc:   change password by accessTK
// @route:  PUT /changePwd
router.put('/changePwd', _ensureAccessToken, changePwd)

// @desc    Remove tokens
// @route   POST /logout
router.post('/logout', _ensureAccessToken, logout)

module.exports = router