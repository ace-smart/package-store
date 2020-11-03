const express = require('express')
const router = express.Router()
const { showCategoryList, getCategoryById, createNewCategory, updateCategoryById, removeCategoryById, getSubcategoryList, addSubcategory, getOneSubcategory, updateSubcategory, removeSubcategory } 
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

// === SUBCATEGORIES ===
// @desc    Get subcategory list
// @route   GET /categories/:id/subcategories
router.get('/:id/subcategories', getSubcategoryList)

// @desc    Get a subcategory
// @route   GET /categories/:id/subcategories/:subcategoryId
router.get('/:id/subcategories/:subcategoryId', getOneSubcategory)

// @desc    Add new subcategory
// @route   POST /categories/:id/subcategories/
router.post('/:id/subcategories', addSubcategory)

// @desc    Update subcategory
// @route   PUT /categories/:id/subcategories/:subcategoryId
router.put('/:id/subcategories/:subcategoryId', updateSubcategory)

// @desc    Delete subcategory
// @route   PUT /categories/:id/subcategories/:subcategoryId
router.delete('/:id/subcategories/:subcategoryId', removeSubcategory)

module.exports = router