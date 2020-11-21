const router = require("express").Router()
const {
    showRestockList,
    showCreateRestockForm,
    createRestock,
    viewRestockById,
    updateRestockById,
    showUpdateForm,
    deactivateRestockById,
    activateRestockById,
    removeRestockById,
} = require("../../controllers/admin/restock.controller")

// @desc    Show list of restocks
// @route   GET /restocks
router.get("/", showRestockList)

// @desc    Get an restock by id
// @route   GET /restocks/view/:id
router.get("/view/:id", viewRestockById)

// @desc    Add a new restock
// @route   get /restocks/add
router.get("/add", showCreateRestockForm)

// @desc    Add a new restock
// @route   POST /restocks/add
router.post("/add", createRestock)

// @desc    Add a new restock
// @route   get /restocks/edit/:id
router.get("/edit/:id", showUpdateForm)

// @desc    Update an restock by id
// @route   PUT /restocks/edit/:id
router.post("/edit/:id", updateRestockById)

// @desc    Update an restock by id
// @route   PUT /restocks/deactivate/:id
router.put("/deactivate/:id", deactivateRestockById)

// @desc    Update an restock by id
// @route   PUT /restocks/activate/:id
router.put("/activate/:id", activateRestockById)

// @desc    Delete an restock by id
// @route   DELETE /restocks/:id
router.delete("/:id", removeRestockById)

module.exports = router
