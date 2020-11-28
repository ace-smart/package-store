const ErrorHandler = require("../helper/errorHandler")
const CategoryObject = require("../objects/CategoryObject")

module.exports = {
  // @desc:   Show categories
  // @route   GET /categories
  showCategoryList: async (req, res) => {
    try {
      const categories = await CategoryObject.getCategoriesBy()
      return res.status(200).json(categories)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get categories by Id
  // @route   GET /categories/:id
  getCategoryById: async (req, res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({ _id: req.params.id })
      
      if (category) {
        return res.status(200).json(category)
      }
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new category
  // @route   POST /categories
  createNewCategory: async (req, res) => {
    try {
      const createdCategory = await CategoryObject.create({...req.body})
      if (createdCategory) {
        return res.status(201).json(createdCategory)
      }
      
      throw new Error("Failed to create category")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update categories
  // @route   PUT /categories/:id
  updateCategoryById: async (req, res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category) {
        const updatedCategory = await category.update({...req.body})
        if (updatedCategory) {
          return res.sendStatus(204)
        }
      }

      throw new Error("Failed to update category")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete categories
  // @route   DELETE /categories/:id
  removeCategoryById: async (req, res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category) {
        const isRemoved = await category.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }
      }
      
      throw new Error("Failed to remove category.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

}
