const router = require('express').Router()
const {_ensureAccessToken, _ensureAdminRole} = require('../helper/auth')
const authRouter = require('./auth.route')
const userRouter = require('./admin/user.route')
const categoryRouter = require('./admin/category.route')

// All below routes have prefix '/api/'
// Client routes
router.use(authRouter)
// Admin routes
router.use('/admin/*', _ensureAccessToken, _ensureAdminRole)
router.use('/admin/users', userRouter)
router.use('/admin/categories', categoryRouter)

module.exports = router