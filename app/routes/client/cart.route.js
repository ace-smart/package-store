const router = require('express').Router()
const { showCart, showCheckoutPage, checkout, createPaymentIntent, validateVoucherCode  } = require('../../controllers/client/cart.controller')

//@desc:    Show shopping cart
//@route:   GET /cart
router.get('/cart', showCart)

//@desc:    Show checkout page
//@route:   GET /checkout
router.get('/checkout', showCheckoutPage)

//@desc:    Show checkout page
//@route:   POST /checkout
router.post('/checkout', checkout)

//@desc:    Create checkout session
//@route:   POST /create-checkout-session'
router.post('/create-payment-intent', createPaymentIntent)

// @desc:   Validate a voucher by code name
// @route:  GET /validate-voucher-code?voucherCode='asdasd'&totalCost='123'
router.get(`/validate-voucher-code`, validateVoucherCode)

module.exports = router