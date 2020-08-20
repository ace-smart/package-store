const express = require('express')
const router = express.Router()
const { showVoucherList, getVoucherById, createNewVoucher, updateVoucherById, removeVoucherById } 
    = require('../../controllers/voucher.controller')

// @desc    Show list of vouchers
// @route   GET /vouchers
router.get('/', showVoucherList)

// @desc    Get voucher by Id
// @route   GET /vouchers/:id
router.get('/:id', getVoucherById)

// @desc    Add new voucher
// @route   POST /vouchers
router.post('/', createNewVoucher)

// @desc    Update voucher
// @route   PUT /vouchers/:id
router.put('/:id', updateVoucherById)

// @desc    Delete voucher
// @route   DELETE /vouchers/:id
router.delete('/:id', removeVoucherById)

module.exports = router