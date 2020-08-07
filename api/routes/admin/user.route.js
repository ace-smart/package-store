const express = require('express')
const router = express.Router()
const { showUserList, getUserById, createNewUser, updateUserById, removeUserById } 
    = require('../../controllers/user.controller')

// @desc    Show list of users
// @route   GET /users
router.get('/', showUserList)

// @desc    Get user by Id
// @route   GET /users/:id
router.get('/:id', getUserById)

// @desc    Add new user
// @route   POST /users
router.post('/', createNewUser)

// @desc    Update user
// @route   PUT /users/:id
router.put('/:id', updateUserById)

// @desc    Delete user
// @route   DELETE /users/:id
router.delete('/:id', removeUserById)

module.exports = router