const router = require("express").Router()

const {
    showCategoryList,
    viewCategoryById,
    showCreateCategoryForm,
    createCategory,
    showUpdateCategoryForm,
    updateCategoryById,
    activateCategoryById,
    deactivateCategoryById,
    removeCategoryById,
    addSubcategory,
    showUpdateSubcateForm,
    updateSubcategoryById,
    deactivateSubcateById,
    activateSubcateById,
    removeSubcateById
} = require("../../controllers/admin/category.controller")

// @desc    Show list of categories
// @route   GET /categories
router.get("/", showCategoryList)

// @desc    Get an category by id
// @route   GET /categories/:id
router.get("/view/:id", viewCategoryById)

// @desc    Add a new category
// @route   get /categories/add
router.get("/add", showCreateCategoryForm)

// @desc    Add a new category
// @route   POST /categories/add
router.post("/add", createCategory)

// @desc    Show update form
// @route   get /categories/edit/:id
router.get("/edit/:id", showUpdateCategoryForm)

// @desc    Update an category by id
// @route   PUT /categories/:id
router.post("/edit/:id", updateCategoryById)

// @desc    Update an category by id
// @route   PUT /categories/activate/:id
router.put("/activate/:id", activateCategoryById)

// @desc    Update an category by id
// @route   PUT /categories/deactivate/:id
router.put("/deactivate/:id", deactivateCategoryById)

// @desc    Delete an category by id
// @route   DELETE /categories/remove/:id
router.delete("/:id", removeCategoryById)

// ==== SUBCATEGORY ===
// @desc    Add a new subcategory
// @route   POST /categories/view/:id/subcategories/add
router.post("/view/:id/subcategories/add", addSubcategory)

// @desc    Show update subcategory form
// @route   GET /categories/view/:id/subcategories/edit/:subId
router.get("/view/:id/subcategories/edit/:subId", showUpdateSubcateForm)

// @desc    Update subcategory form
// @route   POST /categories/view/:id/subcategories/edit/:subId
router.post("/view/:id/subcategories/edit/:subId", updateSubcategoryById)

// @desc    Deactivate a subcategory
// @route   POST /categories/view/:id/subcategories/deactivate/:subId
router.put("/view/:id/subcategories/deactivate/:subId", deactivateSubcateById)

// @desc    Activate a subcategory
// @route   POST /categories/view/:id/subcategories/activate/:subId
router.put("/view/:id/subcategories/activate/:subId", activateSubcateById)

// @desc    Delete subcategory
// @route   DELETE /categories/view/:id/subcategories
router.delete("/view/:id/subcategories/:subId", removeSubcateById)

module.exports = router
