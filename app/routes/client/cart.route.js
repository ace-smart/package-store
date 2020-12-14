const router = require('express').Router()
const { showCart, showCheckoutPage, checkout  } = require('../../controllers/client/cart.controller')

//@desc:    Show shopping cart
//@route:   GET /cart
router.get('/cart', showCart)

//@desc:    Show checkout page
//@route:   GET /checkout
router.get('/checkout', showCheckoutPage)

//@desc:    Show checkout page
//@route:   GET /checkout
router.post('/checkout', checkout)

module.exports = router