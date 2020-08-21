const express = require('express')
const router = express.Router()
const {  showStorageList, getStorageById, createNewStorage, updateStorageById, removeStorageById } 
    = require('../../controllers/storage.controller')

// @desc    Show list of storages
// @route   GET /storages
router.get('/', showStorageList)

// @desc    Get storage by Id
// @route   GET /storages/:id
router.get('/:id', getStorageById)

// @desc    Add new storage
// @route   POST /storages
router.post('/', createNewStorage)

// @desc    Update storage
// @route   PUT /storages/:id
router.put('/:id', updateStorageById)

// @desc    Delete storage
// @route   DELETE /storages/:id
router.delete('/:id', removeStorageById)

module.exports = router