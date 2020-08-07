const router = require('express').Router()
const authRouter = require('./auth.route')
const userRouter = require('./admin/user.route')
const {_ensureAccessToken, _ensureAdminRole} = require('../helper/auth')

// All below routes have prefix '/api/'
// Client routes
router.use(authRouter)
// Admin routes
router.use('/admin/*', _ensureAccessToken, _ensureAdminRole)
router.use('/admin/users', userRouter)

module.exports = router