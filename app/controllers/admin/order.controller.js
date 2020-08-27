const router = require("express").Router()

const {
    showOrderList,
    showCreateOrderForm,
    getOrderById,
    updateOrderById,
    removeOrderById,
} = require("../../controllers/admin/order.controller")

// @desc    Show list of orders
// @route   GET /orders
router.get("/", showOrderList)

// @desc    Get an order by id
// @route   GET /orders/:id
// router.get("/:id", getAccountById)

// @desc    Add a new order
// @route   get /orders/add
router.get("/add", showCreateOrderForm)

// @desc    Add a new order
// @route   POST /orders/add
// router.post("/add", createNewAccount)

// @desc    Update an order by id
// @route   PUT /orders/:id
router.put("/:id", updateOrderById)

// @desc    Delete an order by id
// @route   DELETE /orders/:id
router.delete("/:id", removeOrderById)

module.exports = router
