const express = require('express')
const router = express.Router()
const { showProductList, showProductsByCategoryId, showProductsBySubcategoryId, getProductById, createNewProduct, updateProductById, removeProductById } 
    = require('../../controllers/product.controller')

// @desc    Show list of products
// @route   GET /products
router.get('/', showProductList)

// @desc    Show list of products by categoryId
// @route   GET /products/by-category?categoryId='1234qwer'
router.get('/by-category', showProductsByCategoryId)

// @desc    Show list of products by subcategoryId
// @route   GET /products/by-subcategory?subcategoryId='1234qwer'
router.get('/by-subcategory', showProductsBySubcategoryId)


// @desc    Get product by Id
// @route   GET /products/:id
router.get('/:id', getProductById)

// @desc    Add new product
// @route   POST /products
router.post('/', createNewProduct)

// @desc    Update product
// @route   PUT /products/:id
router.put('/:id', updateProductById)

// @desc    Delete product
// @route   DELETE /products/:id
router.delete('/:id', removeProductById)

module.exports = router