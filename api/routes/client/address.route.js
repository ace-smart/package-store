const express = require('express')
const router = express.Router()
const { getAddress, updateAddressById } 
    = require('../../controllers/address.controller')

// @desc    Get address
// @route   GET /address
router.get('/', getAddress)

// @desc    Update address
// @route   PUT /address
router.put('/', updateAddressById)

module.exports = router