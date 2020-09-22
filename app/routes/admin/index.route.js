const router = require('express').Router()
const {showIndexPage} = require('../../controllers/admin/index.controller')
const {_checkAuthenticatedAdmin} = require('../../helper/auth.helper')

// router.get(['/','/index','/home'], _checkAuthenticatedAdmin, showIndexPage)
router.get(['/','/index','/home'],  showIndexPage)

module.exports = router