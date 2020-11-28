const router = require("express").Router()

const {
    showVoucherList,
    getVoucherById,
    showCreateVoucherForm,
    createVoucher,
    showUpdateVoucherForm,
    updateVoucherById,
    deactivateVoucherById,
    activateVoucherById,
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
router.post("/add", createVoucher)

// @desc    Add a new voucher
// @route   get /vouchers/edit/:id
router.get("/edit/:id", showUpdateVoucherForm)

// @desc    Update an voucher by id
// @route   PUT /vouchers/:id
router.post("/edit/:id", updateVoucherById)

// @desc    Deactivate an voucher by id
// @route   PUT /vouchers/deactivate/:id
router.put("/deactivate/:id", deactivateVoucherById)

// @desc    Activate an voucher by id
// @route   PUT /vouchers/activate/:id
router.put("/activate/:id", activateVoucherById)

// @desc    Delete an voucher by id
// @route   DELETE /vouchers/:id
router.delete("/:id", removeVoucherById)

module.exports = router
