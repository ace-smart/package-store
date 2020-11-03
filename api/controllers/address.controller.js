const AddressObject = require("../objects/AddressObject")
const NotFoundError = require('../errors/not_found')
const ErrorHandler = require('../helper/errorHandler')

module.exports = {
  // @desc:   Show address
  // @route   GET /profile/address/
  showAddressList: async (req, res) => {
    try {
      const addressList = await AddressObject.getAddressListByUserId(req.user.id)
      if (addressList.length > 0) {
        return res.status(200).json({ addresses: addressList })
      }

      throw new NotFoundError("No address found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get addresses by Id
  // @route   GET /profile/address/:id
  getAddressById: async (req, res) => {
    try {
      const address = await AddressObject.getOneAddressById(req.user.id, req.params.id)
      if (address instanceof AddressObject){
        return res.status(200).json({
          address: address,
        })
      }
      
      throw new NotFoundError("No address found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new address
  // @route   POST /profile/address
  createNewAddress: async (req, res) => {
    try {
      const address = await AddressObject.create(req.user.id, {...req.body})
      if (address instanceof AddressObject) {
        return res.sendStatus(201)
      }
      
      throw new Error("Failed to create address")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update address
  // @route   PUT /profile/address/:id
  updateAddressById: async (req, res) => {
    try {
      const address = await AddressObject.getOneAddressById(req.user.id, req.params.id)
      const isUpdated = await address.update(req.user.id, {...req.body})
      if (isUpdated) {
        return res.sendStatus(204)
      }
      
      throw new Error("Failed to create address")
    } catch (error) {
      console.log(error)
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete address
  // @route   DELETE /profile/address/:id
  removeAddressById: async (req, res) => {
    try {
      const address = new AddressObject({_id: req.params.id})
      const isRemoved= await address.remove(req.user.id)
      if (isRemoved) {
        return res.sendStatus(204)
      }
      throw new Error("Failed to remove address")
    } catch (error) {
      console.log(error)  
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
