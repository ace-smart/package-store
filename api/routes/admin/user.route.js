const express = require('express')
const router = express.Router()
const { showUserList, showAdminList,showCustomerList, getUserById, createNewUser, updateUserById, removeUserById } 
    = require('../../controllers/user.controller')
const {_ensureAccessToken, _ensureAdminRole} = require('../../helper/auth')
// @desc    Show list of admins
// @route   GET /users
router.get('/', _ensureAccessToken, _ensureAdminRole ,showUserList)

// @desc    Show list of admins
// @route   GET /users/admins
router.get('/admins', _ensureAccessToken, _ensureAdminRole ,showAdminList)

// @desc    Show list of users
// @route   GET /users/customers
router.get('/customers', _ensureAccessToken, _ensureAdminRole ,showCustomerList)

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