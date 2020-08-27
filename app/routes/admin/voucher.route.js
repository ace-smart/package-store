const router = require("express").Router()

const {
    showVoucherList,
    showCreateVoucherForm,
    getVoucherById,
    updateVoucherById,
    removeVoucherById,
} = require("../../controllers/admin/voucher.controller")

// @desc    Show list of vouchers
// @route   GET /vouchers
router.get("/", showVoucherList)

// @desc    Get an voucher by id
// @route   GET /vouchers/:id
// router.get("/:id", getAccountById)

// @desc    Add a new voucher
// @route   get /vouchers/add
router.get("/add", showCreateVoucherForm)

// @desc    Add a new voucher
// @route   POST /vouchers/add
// router.post("/add", createNewAccount)

// @desc    Update an voucher by id
// @route   PUT /vouchers/:id
router.put("/:id", updateVoucherById)

// @desc    Delete an voucher by id
// @route   DELETE /vouchers/:id
router.delete("/:id", removeVoucherById)

module.exports = router
