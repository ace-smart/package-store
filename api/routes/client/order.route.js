const router = require('express').Router()
const { getOrdersByUserId, getOrderWithUser } = require('../../controllers/order.controller')

// @desc:   Get order by userId
// @route:  GET /my-orders/:userId
router.get('/:userId', getOrdersByUserId)

// @desc:   Get order by userId
// @route:  GET /my-orders/:userId/get-order?orderId='1234'
router.get('/:userId/get-order', getOrderWithUser)

module.exports = router