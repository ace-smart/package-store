const express = require('express')
const router = express.Router()
const {  getProfileById, createNewProfile, updateProfileById, removeProfileById } 
    = require('../../controllers/profile.controller')

// @desc    Show list of users
// @route   GET /users
// router.get('/', showUserList)

// @desc    Get user by Id
// @route   GET /profile/:id
router.get('/:id', getProfileById)

// @desc    Add new user
// @route   POST /profile
router.post('/', createNewProfile)

// @desc    Update user
// @route   PUT /profile/:id
router.put('/:id', updateProfileById)

// @desc    Delete user
// @route   DELETE /profile/:id
router.delete('/:id', removeProfileById)

module.exports = router