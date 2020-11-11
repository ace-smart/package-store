const router = require('express').Router()
const authRouter = require('./auth.route')

router.use(authRouter)

module.exports = router