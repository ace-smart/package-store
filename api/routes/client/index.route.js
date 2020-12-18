const router = require('express').Router()
const { trackOrder } = require('../../controllers/order.controller')
const { validateVoucherCodeName } = require('../../controllers/voucher.controller')

// @desc:   Get shipping cost
// @route:  GET /track-order/:orderId
router.get(`/track-order/:orderId`, trackOrder)

// @desc:   Validate a voucher by code name
// @route:  GET /validate-voucher-code?voucherCode='asdasd'&totalCost='123'
router.get(`/validate-voucher-code`, validateVoucherCodeName)

module.exports = router