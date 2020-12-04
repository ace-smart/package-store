const router = require('express').Router()
const { showMyOrder }  = require('../../controllers/client/order.controller')

//@desc:    Show my order page
//@route:   GET /my-orders
router.get('/my-orders', showMyOrder)


module.exports = router