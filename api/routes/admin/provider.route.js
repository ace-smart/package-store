const express = require('express')
const router = express.Router()
const {  showProviderList, getProviderById, createNewProvider, updateProviderById, removeProviderById } 
    = require('../../controllers/provider.controller')

// @desc    Show list of providers
// @route   GET /providers
router.get('/', showProviderList)

// @desc    Get provider by Id
// @route   GET /providers/:id
router.get('/:id', getProviderById)

// @desc    Add new provider
// @route   POST /providers
router.post('/', createNewProvider)

// @desc    Update provider
// @route   PUT /providers/:id
router.put('/:id', updateProviderById)

// @desc    Delete provider
// @route   DELETE /providers/:id
router.delete('/:id', removeProviderById)

module.exports = router