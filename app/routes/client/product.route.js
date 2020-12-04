const router = require('express').Router()
const {showDetails, showProductsBy} = require('../../controllers/client/product.controller')

//@desc:    Get product details
//@route:   GET /product?id='1234'
router.get('/product', showDetails)

//@desc:    Get products by criteria [search, category, subcategory]
//@route:   GET /products-by
router.get('/products-by', showProductsBy)

module.exports = router