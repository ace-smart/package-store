const RestockObject = require("../objects/RestockObject")
const NotFoundError = require('../errors/not_found')
const ErrorHandler = require('../helper/errorHandler')

module.exports = {
  // @desc:   Show restock
  // @route   GET /restock
  showRestockList: async (req, res) => {
    try {
      const restockList = await RestockObject.getRestocksBy({})
      return res.status(200).json(restockList)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get restock by Id
  // @route   GET /restock/:id
  getRestockById: async (req, res) => {
    try {
      const restock = await RestockObject.getOneRestockBy({_id: req.params.id})
      if (restock) {
        return res.status(200).json(restock)
      }
        
      // Not found
        return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new restock
  // @route   POST /restock
  createNewRestock: async (req, res) => {
    try {
      const createdRestock = await RestockObject.create({...req.body})
      if (createdRestock) {
        return res.status(201).json(createdRestock)
      }

      throw new Error("Failed to create restock.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update restock
  // @route   PUT /restock/:id
  updateRestockById: async (req, res) => {
    try {
      const restock = await RestockObject.getOneRestockBy({_id: req.params.id})
      if (restock) {
        const isUpdated = await restock.update({...req.body})
        if (isUpdated){
          return res.sendStatus(204)
        }

        throw new Error("Failed to update restock.")
      }

      throw new NotFoundError("No restock found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete restock
  // @route   DELETE /restock/:id
  removeRestockById: async (req, res) => {
    try {
      const restock = await RestockObject.getOneRestockBy({_id: req.params.id})
      if (restock) {
        const isRemoved = await restock.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to remove restock")
      }

      throw new NotFoundError("No restock found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
