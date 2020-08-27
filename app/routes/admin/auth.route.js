const router = require('express').Router()
const {login, showLoginForm} = require('../../controllers/admin/auth.controller')


// @desc    Show login form
// @route   GET /login
router.get("/login", showLoginForm)

// @desc    Authentication
// @route   POST /login
router.post("/login", login)

// @desc    Logout
// @route   GET /logout
router.get("/logout", (req,res) => {
    
})

module.exports = router