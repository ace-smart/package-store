const express = require('express')
const router = express.Router()
const {show, get } = require('../../controllers/api/user.controller')

// @desc    Get list of users
// @route   GET /users
router.get('/', show)

// @desc    Get user by Id
// @route   GET /users/:id
router.get('/:id', get)

// @desc    Add new user
// @route   GET /users
router.post('/', (req, res) => {})

// @desc    Update user
// @route   PUT /users/:id
router.put('/:id', (req, res) => {})

// @desc    Delete user
// @route   DELETE /users/:id
router.delete('/:id', (req, res) => {})

module.exports = router