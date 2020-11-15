const ErrorHandler = require("../helper/errorHandler")
const SubcategoryObject = require("../objects/SubcategoryObject")

module.exports = {
  // @desc:   Show subcategories
  // @route   GET /subcategories?categoryId='1234'
  showSubcategoriesByCategoryId: async (req, res) => {
    try {
      const subcategories = await SubcategoryObject.getSubcategoriesBy({categoryId: req.query.categoryId})
      return res.status(200).json(subcategories)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get subcategories by Id
  // @route   GET /subcategories/:id
  getSubcategoryById: async (req, res) => {
    try {
      const subcategory = await SubcategoryObject.getOneSubcategoryBy({ _id: req.params.id })
      if (subcategory) {
        return res.status(200).json(subcategory)
      }
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new category
  // @route   POST /subcategories
  createNewSubcategory: async (req, res) => {
    try {
      const createdSubcategory = await SubcategoryObject.create({...req.body})
      if (createdSubcategory) {
        return res.status(201).json(createdSubcategory)
      }
      
      throw new Error("Failed to create category")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update subcategories
  // @route   PUT /subcategories/:id
  updateSubcategoryById: async (req, res) => {
    try {
      const subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: req.params.id})
      if (subcategory) {
        const updatedSubcategory = await subcategory.update({...req.body})
        if (updatedSubcategory) {
          return res.sendStatus(204)
        }
      }

      throw new Error("Failed to update subcategory")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete subcategories
  // @route   DELETE /subcategories/:id
  removeSubcategoryById: async (req, res) => {
    try {
      const subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: req.params.id})
      if (subcategory) {
        const isRemoved = await subcategory.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }
      }
      
      throw new Error("Failed to remove subcategory.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  }
}
