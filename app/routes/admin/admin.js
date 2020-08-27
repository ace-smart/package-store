const router = require('express').Router()
const authRouter = require('./auth.route')
const indexRouter = require('./index.route')
const administratorRouter = require('./administrator.route')
const customerRouter = require('./customer.route')

router.use(authRouter)
router.use(indexRouter)
router.use('/customers', customerRouter)
router.use('/administrators', administratorRouter)

module.exports = router