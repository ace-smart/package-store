const router = require("express").Router()
const {
  showProductsByCategoryId,
  showProductsBySubcategoryId,
  getProductById,
  showRelatedProducts,
  showAllProducts,
  getBestSellers, 
  searchProductsByName
} = require("../../controllers/product.controller")

//@desc:    Get all products
//@route:   GET /all-products
router.get("/all-products", showAllProducts)

//@desc:    Get best sellers
//@route:   GET /all-products
router.get("/get-best-sellers", getBestSellers)

//@desc:    Get related products
//@route:   GET /related-products?id='1234'
router.get("/related-products", showRelatedProducts)

//@desc:    Get products by subcategory
//@route:   GET /products-by?criteria='1234'
router.get("/products-by-subcategory", showProductsBySubcategoryId)

//@desc:    Get products by category
//@route:   GET /products-by-category?categoryId='1234'
router.get("/products-by-category", showProductsByCategoryId)

  // @desc:   Search products by name
  // @route   GET /search-products?name='1234'
router.get("/search-products", searchProductsByName)

//@desc:    Get a product by id
//@route:   GET /products/:id
router.get("/product/:id", getProductById)

module.exports = router
