const router = require('express').Router()
const { trackOrder } = require('../../controllers/order.controller')

// @desc:   Get shipping cost
// @route:  /track-order/:orderId
router.get(`/track-order/:orderId`, trackOrder)

module.exports = router