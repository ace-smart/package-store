const VoucherObject = require("../objects/VoucherObject")
const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")

module.exports = {
  // @desc:   Show vouchers
  // @route   GET /vouchers
  showVoucherList: async (req, res) => {
    try {
      const vouchers = await VoucherObject.getVouchersBy({})

      return res.status(200).json(vouchers)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get vouchers by Id
  // @route   GET /vouchers/:id
  getVoucherById: async (req, res) => {
    try {
      const voucher = await VoucherObject.getOneVoucherBy({_id: req.params.id})
      if (voucher){
        return res.status(200).json(voucher)
       } 
      // Not found
        return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new voucher
  // @route   POST /vouchers
  createNewVoucher: async (req, res) => {
    try {
      const createdVoucher = await VoucherObject.create({...req.body})
      if (createdVoucher) {
        return res.status(201).json(createdVoucher)
      }

      throw new Error("Failed to create voucher.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update voucher
  // @route   PUT /vouchers/:id
  updateVoucherById: async (req, res) => {
    try {
      const voucher = await VoucherObject.getOneVoucherBy({_id: req.params.id})
      if (voucher) {
        const isUpdated = await voucher.update({...req.body})
        if (isUpdated){
          return res.sendStatus(204)
        }

        throw new Error("Failed to update voucher.")
      }
      
      throw new NotFoundError("No voucher found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete voucher
  // @route   DELETE /vouchers/:id
  removeVoucherById: async (req, res) => {
    try {
      const voucher = await VoucherObject.getOneVoucherBy({_id: req.params.id})
      if (voucher) {
        const isRemoved = await voucher.remove()
        if (isRemoved){
          return res.sendStatus(204)
        }

        throw new Error("Failed to remove voucher.")
      }
      
      throw new NotFoundError("No voucher found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
