const router = require("express").Router()
const {
    showAccountList,
    showAdminList,
    showCustomerList,
    showCreateUserForm,
    createUser,
    viewUserById,
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
router.get("/", showAccountList)

// @desc    Show list of administrators
// @route   GET /accounts/admins
router.get("/admins", showAdminList)

// @desc    Show list of customers
// @route   GET /accounts/customers
router.get("/customers", showCustomerList)

// @desc    Get an admin by id
// @route   GET /accounts/view/:id
router.get("/view/:id", viewUserById)

// @desc    Show create form
// @route   get /accounts/add
router.get("/add", showCreateUserForm)

// @desc    Add a new user
// @route   POST /accounts/add
router.post("/add", createUser)

// @desc    View user information
// @route   get /accounts/edit/:id
router.get("/view/:id", showEditUserForm)

// @desc    Show edit form
// @route   get /accounts/edit/:id
router.get("/edit/:id", showEditUserForm)

// @desc    Edit user by id
// @route   POST /accounts/edit/:id
router.post("/edit/:id", editUserById)

// @desc    Update an admin by id
// @route   PUT /accounts/:id
router.put("/activate/:id", activateUserById)

// @desc    Update an admin by id
// @route   PUT /accounts/:id
router.put("/deactivate/:id", deactivateUserById)

// @desc    Update an admin by id
// @route   PUT /accounts/reset-password
router.put("/reset-password", resetPassword)

// @desc    Delete an admin by id
// @route   DELETE /accounts/:id
router.delete("/:id", removeUserById)

module.exports = router
