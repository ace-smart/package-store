const router = require("express").Router()

const {
    showRestockList,
    showCreateRestockForm,
    getRestockById,
    updateRestockById,
    removeRestockById,
} = require("../../controllers/admin/restock.controller")

// @desc    Show list of restocks
// @route   GET /restocks
router.get("/", showRestockList)

// @desc    Get an restock by id
// @route   GET /restocks/:id
// router.get("/:id", getAccountById)

// @desc    Add a new restock
// @route   get /restocks/add
router.get("/add", showCreateRestockForm)

// @desc    Add a new restock
// @route   POST /restocks/add
// router.post("/add", createNewAccount)

// @desc    Update an restock by id
// @route   PUT /restocks/:id
router.put("/:id", updateRestockById)

// @desc    Delete an restock by id
// @route   DELETE /restocks/:id
router.delete("/:id", removeRestockById)

module.exports = router
