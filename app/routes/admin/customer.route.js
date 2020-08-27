const router = require("express").Router()

const {
    showCustomerList,
    showCreateCustomerForm,
    getCustomerById,
    updateCustomerById,
    removeCustomerById,
} = require("../../controllers/admin/customer.controller")

// @desc    Show list of customers
// @route   GET /customers
router.get("/", showCustomerList)

// @desc    Get customer by id
// @route   GET /customers/:id
// router.get("/:id", getCustomerById)

// @desc    Add a new customer
// @route   get /customers/add
router.get("/add", showCreateCustomerForm)

// @desc    Add a new customer
// @route   POST /customers/add
// router.post("/add", createNewAccount)

// @desc    Update an customer by id
// @route   PUT /customers/:id
router.put("/:id", updateCustomerById)

// @desc    Delete an customer by id
// @route   DELETE /customers/:id
router.delete("/:id", removeCustomerById)

module.exports = router
