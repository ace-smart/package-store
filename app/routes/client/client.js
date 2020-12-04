const router = require('express').Router()
const {_autoRenewAccessToken, _loginWithCookie} = require('../../helper/auth_client.helper')
const {_checkAuthenticatedCustomer} = require('../../helper/auth.helper')

const indexRouter = require('./index.route')
const authRouter = require('./auth.route')
const productRouter = require('./product.route')
const cartRouter = require('./cart.route')
const accountRouter = require('./account.route')
const orderRouter = require('./order.route')

router.use(_autoRenewAccessToken)
router.use(_loginWithCookie)
router.use(authRouter)
router.use(indexRouter)
router.use(productRouter)
router.use(cartRouter)
router.use(accountRouter)
router.use(orderRouter)
// router.use(_checkAuthenticatedCustomer)

module.exports = router