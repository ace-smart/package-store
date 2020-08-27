const router = require('express').Router()
const {showIndexPage} = require('../../controllers/admin/index.controller')

router.get(['/','/index','/home'], showIndexPage)

module.exports = router