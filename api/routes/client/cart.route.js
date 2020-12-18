const router = require('express').Router()
const {checkout, getShippingCost, validateDeliveryInfo, calculateTotalCost }  = require('../../controllers/order.controller')

// @desc:   Get shipping cost
// @route:  /get-shipping-cost
router.get(`/get-shipping-cost`, getShippingCost)

// @desc:   Validate delivery information
// @route:  POST /validate-delivery-info
router.post(`/validate-delivery-info`, validateDeliveryInfo)

// @desc:   Place order
// @route:  POST /checkout
router.post(`/checkout`, checkout)

// @desc:   Calculate total cost
// @route:  POST /calculate-total-cost
router.post('/calculate-total-cost', calculateTotalCost)

module.exports = router
