const router = require("express").Router()

const {
    showProductList,
    viewProductById,
    getProductById,
    showCreateProductForm,
    createProduct,
    showUpdateForm,
    updateProductById,
    deactivateProductById,
    activateProductById,
    removeProductById,
    showGallery,
    addToGallery,
    removeImageById
} = require("../../controllers/admin/product.controller")

// @desc    Show list of products
// @route   GET /products
router.get("/", showProductList)

//@desc     Show gallery page
//@route    GET /products/gallery?productId='123'
router.get("/gallery", showGallery)

//@desc     Show gallery page
//@route    GET /products/gallery/add
router.post("/gallery/add", addToGallery)

// @desc    Delete image in gallery
    // @route   DELETE /products/:id
router.delete("/gallery/:id", removeImageById)

// @desc    Get an product by id
// @route   GET /products/view/:id
router.get("/view/:id", viewProductById)

// @desc    Get an product by id
// @route   GET /products/get-data/:id
router.get("/get-data/:id", getProductById)

// @desc    Add a new product
// @route   get /products/add
router.get("/add", showCreateProductForm)

// @desc    Add a new product
// @route   POST /products/add
router.post("/add", createProduct)

// @desc    Show update form
// @route   get /products/edit/:id
router.get("/edit/:id", showUpdateForm)

// @desc    Update an product by id
// @route   PUT /products/:id
router.post("/edit/:id", updateProductById)

// @desc    Update an product by id
// @route   PUT /products/deactivate/:id
router.put("/deactivate/:id", deactivateProductById)

// @desc    Update an product by id
// @route   PUT /products/activate/:id
router.put("/activate/:id", activateProductById)

// @desc    Delete an product by id
// @route   DELETE /products/:id
router.delete("/:id", removeProductById)


module.exports = router
