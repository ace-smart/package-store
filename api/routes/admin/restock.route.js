const express = require('express')
const router = express.Router()
const {  showRestockList, getRestockById, createNewRestock, updateRestockById, removeRestockById } 
    = require('../../controllers/restock.controller')

// @desc    Show list of restock
// @route   GET /restock
router.get('/', showRestockList)

// @desc    Get restock by Id
// @route   GET /restock/:id
router.get('/:id', getRestockById)

// @desc    Add new restock
// @route   POST /restock
router.post('/', createNewRestock)

// @desc    Update restock
// @route   PUT /restock/:id
router.put('/:id', updateRestockById)

// @desc    Delete restock
// @route   DELETE /restock/:id
router.delete('/:id', removeRestockById)

module.exports = router