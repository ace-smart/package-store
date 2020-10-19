const express = require('express')
const router = express.Router()
const { auth, renewAccessToken, register, logout } = require('../controllers/auth.controller')
const { _ensureAccessToken } = require('../helper/auth')

// @desc    Generate tokens
// @route   POST /auth
router.post('/auth', auth)

// @desc    Renew access token
// @route   GET /token
router.get('/token', renewAccessToken)

// @desc    Register
// @route   POST /register
router.post('/register', register)

// @desc    Remove tokens
// @route   POST /logout
router.post('/logout', _ensureAccessToken, logout)

module.exports = router