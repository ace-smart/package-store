const router = require('express').Router()
const { showMyAccount } = require('../../controllers/client/account.controller')

//@desc:    Show my account page
//@route:   GET /my-account
router.get('/my-account', showMyAccount)

module.exports = router