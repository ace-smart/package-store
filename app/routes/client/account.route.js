const router = require('express').Router()
const { showMyAccount, updateProfile, changePassword, updateAddress } = require('../../controllers/client/account.controller')
const {_checkAuthenticatedCustomer} = require('../../helper/auth.helper')
const { getUserInstance } = require('../../helper/helper')

//@desc:    Show my account page
//@route:   GET /my-account
router.get('/my-account', _checkAuthenticatedCustomer, showMyAccount)

//@desc:    Update profile
//@route:   POST /my-account/profile
router.post('/my-account', _checkAuthenticatedCustomer, updateProfile)

//@desc:    Change password
//@route:   GET /my-account/change-password
router.get('/my-account/change-password', async (req, res, next) => {
  return res.render("templates/client/account/my-account", {
    layout: "client/index.layout.hbs",
    user: await getUserInstance(req),
    tabContent: 'change-password',
    csrfToken: req.csrfToken(),
  })
})

//@desc:    Change password
//@route:   POST /my-account/change-password
router.post('/my-account/change-password', _checkAuthenticatedCustomer, changePassword)

//@desc:    Update address
//@route:   GET /my-account/address
router.get('/my-account/address', async (req, res, next) => {
  return res.render("templates/client/account/my-account", {
    layout: "client/index.layout.hbs",
    user: await getUserInstance(req),
    tabContent: 'address',
    csrfToken: req.csrfToken(),
  })
})

//@desc:    Update address
//@route:   POST /my-account/address
router.post('/my-account/address', _checkAuthenticatedCustomer, updateAddress)

module.exports = router