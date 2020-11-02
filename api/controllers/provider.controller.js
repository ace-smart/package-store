const ProviderObject = require("../objects/ProviderObject")
const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")

module.exports = {
  // @desc:   Show providers
  // @route   GET /providers
  showProviderList: async (req, res) => {
    try {
      const providerList = await ProviderObject.getProvidersBy({})
      if (providerList && providerList.length > 0) {
        return res.status(200).json(providerList)
      }
      // Not found
      throw new NotFoundError("No provider found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get providers by Id
  // @route   GET /providers/:id
  getProviderById: async (req, res) => {
    try {
      const provider = await ProviderObject.getOneProviderBy({_id: req.params.id})
      if (provider) {
        return res.status(200).json(provider)
      }
      // Not found
      throw new NotFoundError("No provider found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new category
  // @route   POST /providers
  createNewProvider: async (req, res) => {
    try {
      const createProvider = await ProviderObject.create({...req.body})
      if (createProvider) {
        return res.status(200).json(createProvider)
      }

      throw new Error("Failed to create provider.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update providers
  // @route   PUT /providers/:id
  updateProviderById: async (req, res) => {
    try {
      const provider = await ProviderObject.getOneProviderBy({_id: req.params.id})
      if (provider) {
        const updatedProvider = await provider.update({...req.body})
        if (updatedProvider) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to update provider.")
      }

      throw new NotFoundError("No provider found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete providers
  // @route   DELETE /providers/:id
  removeProviderById: async (req, res) => {
    try {
      const provider = await ProviderObject.getOneProviderBy({_id: req.params.id})
      if (provider) {
        const isRemoved = await provider.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to remove provider.")
      }
      
      throw new NotFoundError("No Provider found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
