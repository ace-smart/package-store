const router = require('express').Router()
const {_autoRenewAccessToken, _loginWithCookie} = require('../../helper/auth_client.helper')
const {_checkAuthenticatedCustomer} = require('../../helper/auth.helper')

const indexRouter = require('./index.route')
const authRouter = require('./auth.route')

router.use(_autoRenewAccessToken)
router.use(_loginWithCookie)
router.use(authRouter)
router.use(indexRouter)
// router.use(_checkAuthenticatedCustomer)

module.exports = router