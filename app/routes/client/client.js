const router = require('express').Router()
const indexRouter = require('./index.route')
const authRouter = require('./auth.route')

router.use(indexRouter)
router.use(authRouter)

module.exports = router