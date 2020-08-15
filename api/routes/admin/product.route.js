const express = require('express')
const router = express.Router()
const { showProductList, getProductById, createNewProduct, updateProductById, removeProductById } 
    = require('../../controllers/product.controller')

// @desc    Show list of products
// @route   GET /products
router.get('/', showProductList)

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