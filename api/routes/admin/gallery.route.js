const router = require('express').Router()
const {
    showProductGallery,
    getProductImg,
    createNewImage,
    updateProductImage,
    removeProductImage,
} = require("../../controllers/gallery.controller")

// @desc    get product gallery
// @route   GET /gallery?productId='1234'
router.get("/", showProductGallery)

// @desc    get product gallery
// @route   GET /gallery/:id
router.get("/:id", getProductImg)

// @desc    Create a new image
// @route   POST /gallery/id='1234'
router.post("/", createNewImage)

// @desc    Update image
// @route   PUT /gallery/id='1234'
router.put("/:id", updateProductImage)

// @desc    Remove image
// @route   DELETE /gallery/id='1234'
router.delete("/:id", removeProductImage)

module.exports = router