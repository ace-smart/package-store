const router = require("express").Router()

const {
    showStorageList,
    viewStorageById,
    showCreateStorageForm,
    createStorage,
    showUpdateStorageForm,
    updateStorageById,
    setFullStorage,
    setAvailableStorage,
    removeStorageById,
} = require("../../controllers/admin/storage.controller")

// @desc    Show list of storages
// @route   GET /storages
router.get("/", showStorageList)

// @desc    View an storage by id
// @route   GET /storages/view/:id
router.get("/view/:id", viewStorageById)

// @desc    Show create storage form
// @route   get /storages/add
router.get("/add", showCreateStorageForm)

// @desc    Add a new storage
// @route   POST /storages/add
router.post("/add", createStorage)

// @desc    Show update storage form
// @route   get /storages/add
router.get("/edit/:id", showUpdateStorageForm)

// @desc    Update an storage by id
// @route   PUT /storages/:id
router.post("/edit/:id", updateStorageById)

// @desc    Set 'Available' status
// @route   PUT /storages/set-available/:id
router.put("/set-available/:id", setAvailableStorage)

// @desc    Set 'Full' status
// @route   PUT /storages/set-full/:id
router.put("/set-full/:id", setFullStorage)

// @desc    Delete an storage by id
// @route   DELETE /storages/:id
router.delete("/:id", removeStorageById)

module.exports = router
