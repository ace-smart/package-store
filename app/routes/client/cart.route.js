const router = require('express').Router()
const { showCart, showCheckoutPage } = require('../../controllers/client/cart.controller')

//@desc:    Show shopping cart
//@route:   GET /cart
router.get('/cart', showCart)

//@desc:    Show checkout page
//@route:   GET /checkout
router.get('/checkout', showCheckoutPage)

module.exports = router