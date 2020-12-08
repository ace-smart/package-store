const router = require('express').Router()
const {showDetails, showProductsByCategory, showProductsBySubcategory, searchProductsByName} = require('../../controllers/client/product.controller')

//@desc:    Get products by category
//@route:   GET /products-by?categoryId='1234'
router.get('/products-by-category', showProductsByCategory)

//@desc:    Get products by subcategory
//@route:   GET /products-by?subcategoryId='1234'
router.get('/products-by-subcategory', showProductsBySubcategory)

//@desc:    Search products 
//@route:   GET /search-products
router.get('/search-products', searchProductsByName)

//@desc:    Get product details
//@route:   GET /product?id='1234'
router.get('/product', showDetails)


module.exports = router