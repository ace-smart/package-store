const router = require('express').Router()
const { showOrderList, getOrderById, createNewOrder, updateOrderById, removeOrderById } 
    = require('../../controllers/order.controller')
const orderDetailRouter = require('./order_detail.route')

// @desc    Show list of orders
// @route   GET /orders
router.get('/', showOrderList)


// @desc    Get order by Id
// @route   GET /orders/:id
router.get('/:id', getOrderById)

// @desc    Add new order
// @route   POST /orders
router.post('/', createNewOrder)

// @desc    Update order
// @route   PUT /orders/:id
router.put('/:id', updateOrderById)

// @desc    Delete order
// @route   DELETE /orders/:id
router.delete('/:id', removeOrderById)

/** === Order details ===*/
router.use('/:id/details', orderDetailRouter)

module.exports = router