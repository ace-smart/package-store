const router = require("express").Router()

const {
    showCategoryList,
    getCategoryById,
    showCreateCategoryForm,
    updateCategoryById,
    removeCategoryById
} = require("../../controllers/admin/category.controller")

// @desc    Show list of categories
// @route   GET /categories
router.get("/", showCategoryList)

// @desc    Get an category by id
// @route   GET /categories/:id
// router.get("/:id", getCategoryById)

// @desc    Add a new category
// @route   get /categories/add
router.get("/add", showCreateCategoryForm)

// @desc    Add a new category
// @route   POST /categories/add
// router.post("/add", createNewAccount)

// @desc    Update an category by id
// @route   PUT /categories/:id
router.put("/:id", updateCategoryById)

// @desc    Delete an category by id
// @route   DELETE /categories/:id
router.delete("/:id", removeCategoryById)

module.exports = router
