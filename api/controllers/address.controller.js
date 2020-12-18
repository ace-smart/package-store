const AddressObject = require("../objects/AddressObject")
const UserObject = require("../objects/UserObject")
const UserModel = require('../models/UserModel')
const NotFoundError = require('../errors/not_found')
const ErrorHandler = require('../helper/errorHandler')

module.exports = {
  // @desc:   Get addresses by Id
  // @route   GET /profile/address
  getAddress: async (req, res) => {
    try {
      const address = await AddressObject.getOneAddressById(req.user.id)
      if (address){
        return res.status(200).json(address)
      }
      
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update address
  // @route   PUT /profile/address/:id
  updateAddressById: async (req, res) => {
    /* === EXAMPLE ===
      req.body = {
        street: '123/12 John qw',
        district: 'Smith',
        city: 'LA',
        country: 'USA',
        postalCode: '123456'
      }
    */
    try {
      // Get addressId by userId
      const addressId = await UserObject.getAddressById(req.user.id)
      let addressData = JSON.parse(JSON.stringify(req.body))
      
      // create for the 1st time
      if (addressId == null) {
        const createdAddress = await AddressObject.create(addressData)
        if (createdAddress) {
          const user = await UserModel.findOneAndUpdate({_id: addressData.userId}, {addressId: createdAddress.id}).lean()
          if (user){
            return res.sendStatus(204)
          }
        }
      } else {
        // update
        const addressObject = await AddressObject.getOneAddressById(addressId)
        const isUpdated = await addressObject.update({...addressData})
        if (isUpdated) {
          return res.sendStatus(204)
        }
      }
      
      throw new Error("Failed to update address")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

}
