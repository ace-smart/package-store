const express = require('express')
const router = express.Router()
const { showCategoryList, getCategoryById, createNewCategory, updateCategoryById, removeCategoryById } 
    = require('../../controllers/category.controller')

// @desc    Show list of categories
// @route   GET /categories
router.get('/', showCategoryList)

// @desc    Get category by Id
// @route   GET /categories/:id
router.get('/:id', getCategoryById)

// @desc    Add new category
// @route   POST /categories
router.post('/', createNewCategory)

// @desc    Update category
// @route   PUT /categories/:id
router.put('/:id', updateCategoryById)

// @desc    Delete category
// @route   DELETE /categories/:id
router.delete('/:id', removeCategoryById)

module.exports = router