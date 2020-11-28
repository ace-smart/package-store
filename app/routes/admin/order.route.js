const router = require("express").Router()

const {
    showOrderList,
    viewOrderById,
    showCreateOrderForm,
    createOrder,
    showUpdateOrderForm,
    updateOrderById,
    previousStage,
    nextStage,
    finalStage,
    removeOrderById,
} = require("../../controllers/admin/order.controller")

// @desc    Show list of orders
// @route   GET /orders
router.get("/", showOrderList)

// @desc    Get an order by id
// @route   GET /orders/:id
router.get("/view/:id", viewOrderById)

// @desc    Add a new order
// @route   get /orders/add
router.get("/add", showCreateOrderForm)

// @desc    Add a new order
// @route   POST /orders/add
router.post("/add", createOrder)

// @desc    Add a new order
// @route   get /orders/add
router.get("/edit/:id", showUpdateOrderForm)

// @desc    Update an order by id
// @route   PUT /orders/:id
router.post("/edit/:id", updateOrderById)

// @desc    Update status
// @route   PUT /orders/next-stage
router.put("/next-stage", nextStage)

// @desc    Update status
// @route   PUT /orders/previous-stage
router.put("/previous-stage", previousStage)

// @desc    Update status
// @route   PUT /orders/final-stage
router.put("/final-stage", finalStage)

// @desc    Delete an order by id
// @route   DELETE /orders/:id
router.delete("/:id", removeOrderById)

module.exports = router
