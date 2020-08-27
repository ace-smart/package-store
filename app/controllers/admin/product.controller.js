const router = require("express").Router()

const {
    showProductList,
    showCreateProductForm,
    getProductById,
    updateProductById,
    removeProductById,
} = require("../../controllers/admin/product.controller")

// @desc    Show list of products
// @route   GET /products
router.get("/", showProductList)

// @desc    Get an product by id
// @route   GET /products/:id
// router.get("/:id", getAccountById)

// @desc    Add a new product
// @route   get /products/add
router.get("/add", showCreateProductForm)

// @desc    Add a new product
// @route   POST /products/add
// router.post("/add", createNewAccount)

// @desc    Update an product by id
// @route   PUT /products/:id
router.put("/:id", updateProductById)

// @desc    Delete an product by id
// @route   DELETE /products/:id
router.delete("/:id", removeProductById)

module.exports = router
