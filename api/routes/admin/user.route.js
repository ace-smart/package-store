const express = require('express')
const router = express.Router()
const { showUserList, showAdminList,showCustomerList, getUserById, createNewUser, updateUserById, resetPasswordById, removeUserById } 
    = require('../../controllers/user.controller')

// @desc    Show list of admins
// @route   GET /users
router.get('/',showUserList)

// @desc    Show list of admins
// @route   GET /users/admins
router.get('/admins', showAdminList)

// @desc    Show list of users
// @route   GET /users/customers
router.get('/customers', showCustomerList)

// @desc    Get user by Id
// @route   GET /users/:id
router.get('/:id', getUserById)

// @desc    Add new user
// @route   POST /users
router.post('/', createNewUser)

// @desc    Update user
// @route   PUT /users/reset-password
router.put('/reset-password', resetPasswordById)

// @desc    Update user
// @route   PUT /users/:id
router.put('/:id', updateUserById)

// @desc    Delete user
// @route   DELETE /users/:id
router.delete('/:id', removeUserById)

module.exports = router