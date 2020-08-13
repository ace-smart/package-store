const express = require('express')
const router = express.Router()
const { showAddressList, getAddressById, createNewAddress, updateAddressById, removeAddressById } 
    = require('../../controllers/address.controller')
const { createNewProfile } = require('../../controllers/profile.controller')

// @desc    Show list of addresses
// @route   GET /addresses
router.get('/', showAddressList)

// @desc    Get address by Id
// @route   GET /addresses/:id
router.get('/:id', getAddressById)

// @desc    Add new address
// @route   POST /addresses
router.post('/', createNewAddress)

// @desc    Update address
// @route   PUT /addresses/:id
router.put('/:id', updateAddressById)

// @desc    Delete address
// @route   DELETE /addresses/:id
router.delete('/:id', removeAddressById)

module.exports = router