const StorageObject = require("../objects/StorageObject")
const ErrorHandler = require('../helper/errorHandler')
const NotFoundError = require('../errors/not_found')

module.exports = {
  // @desc:   Show storages
  // @route   GET /storages
  showStorageList: async (req, res) => {
    try {
      const storageList = await StorageObject.getStoragesBy({})
      return res.status(200).json(storageList)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get storages by Id
  // @route   GET /storages/:id
  getStorageById: async (req, res) => {
    try {
      const storage = await StorageObject.getOneStorageBy({_id: req.params.id})
      if (storage){
        return res.status(200).json(storage)
      }
      // Not found
        return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new storage
  // @route   POST /storages
  createNewStorage: async (req, res) => {
    try {
      const createdStorage = await StorageObject.create({...req.body})
      if (createdStorage) {
        return res.status(201).json(createdStorage)
      }
      
      throw new Error("Failed to create storage.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update storages
  // @route   PUT /storages/:id
  updateStorageById: async (req, res) => {
    try {
      const storage = await StorageObject.getOneStorageBy({_id: req.params.id})
      if (storage) {
        const isUpdated = await storage.update({...req.body})
        if (isUpdated) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to update storage.")
      }
      throw new NotFoundError("No storage found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete storages
  // @route   DELETE /storages/:id
  removeStorageById: async (req, res) => {
    try {
      const storage = await StorageObject.getOneStorageBy({_id: req.params.id})
      if (storage) {
        const isRemoved = await storage.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to remove storage.")
      }

      throw new NotFoundError("No storage found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
