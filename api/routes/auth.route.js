const express = require('express')
const router = express.Router()
const { auth, renewAccessToken, logout } = require('../controllers/auth.controller')

// @desc    Generate tokens
// @route   POST /auth
router.post('/auth', auth)

// @desc    Renew access token
// @route   POST /token
router.post('/token', renewAccessToken)

// @desc    Remove tokens
// @route   POST /removeTokens
router.post('/logout', logout)

module.exports = router