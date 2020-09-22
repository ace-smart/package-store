const router = require("express").Router()
const {
    showAccountList,
    showAdminList,
    showCustomerList,
    showCreateUserForm,
    createUser,
    getUserById,
    showEditUserForm,
    editUserById,
    activateUserById,
    deactivateUserById,
    resetPassword,
    removeUserById,
} = require("../../controllers/admin/account.controller")
const {_checkAuthenticatedAdmin} = require('../../helper/auth.helper')

// @desc    Show list of administrators
// @route   GET /accounts
router.get("/", _checkAuthenticatedAdmin, showAccountList)

// @desc    Show list of administrators
// @route   GET /accounts/admins
router.get("/admins", _checkAuthenticatedAdmin, showAdminList)

// @desc    Show list of customers
// @route   GET /accounts/customers
router.get("/customers", _checkAuthenticatedAdmin, showCustomerList)

// @desc    Get an admin by id
// @route   GET /accounts/:id
// router.get("/:id", getAccountById)

// @desc    Show create form
// @route   get /accounts/add
router.get("/add", _checkAuthenticatedAdmin, showCreateUserForm)

// @desc    Add a new user
// @route   POST /accounts/add
router.post("/add", _checkAuthenticatedAdmin, createUser)

// @desc    Show edit form
// @route   get /accounts/edit/:id
router.get("/edit/:id", showEditUserForm)

// @desc    Edit user by id
// @route   POST /accounts/edit/:id
router.post("/edit/:id", editUserById)

// @desc    Update an admin by id
// @route   PUT /administrators/:id
router.put("/activate/:id", activateUserById)

// @desc    Update an admin by id
// @route   PUT /users/:id
router.put("/deactivate/:id", deactivateUserById)

// @desc    Update an admin by id
// @route   PUT /administrators/:id
router.put("/reset_password/:id", resetPassword)

// @desc    Delete an admin by id
// @route   DELETE /user/:id
router.delete("/:id", removeUserById)

module.exports = router
