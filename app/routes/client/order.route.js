const router = require('express').Router()
const { showMyOrder, viewMyOrderById }  = require('../../controllers/client/order.controller')
const { _checkAuthenticatedCustomer } = require('../../helper/auth.helper')

//@desc:    Show my order page
//@route:   GET /my-orders
router.get('/my-orders', _checkAuthenticatedCustomer, showMyOrder)

//@desc:    Show my order page
//@route:   GET /my-orders
router.get('/my-orders/view/:orderId', _checkAuthenticatedCustomer, viewMyOrderById)


module.exports = router