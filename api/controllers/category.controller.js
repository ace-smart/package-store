const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")
const SubcategoryModel = require("../models/SubcategoryModel")
const CategoryObject = require("../objects/CategoryObject")
const SubcategoryObject = require("../objects/SubcategoryObject")

module.exports = {
  // @desc:   Show categories
  // @route   GET /categories
  showCategoryList: async (req, res) => {
    try {
      const selectFields = "name subcategories status createdAt"
      const categories = await CategoryObject.getCategoriesBy({}, selectFields)
      return res.status(200).json({ categories: categories })
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
        return res.status(200).json({ category: category })
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

  /*  === SUBCATEGORY === */

  // @desc    Get subcategory list
  // @route   GET /categories/:id/subcategories
  getSubcategoryList: async (req,res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category) {
        let subcategoryList = new Array()
        for(let i =0; i < category.getSubcategories.length; i++) {
          const subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: category.getSubcategories[i]})
          if (subcategory) {
            subcategoryList.push(subcategory)
          }
        }

        if (subcategoryList.length > 0) {
          return res.status(200).json(subcategoryList)
        }
        throw new NotFoundError("No subcategory found.")
      }

      throw new NotFoundError("No category found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Get a subcategory
  // @route   GET /categories/:id/subcategories/:subcategoryId
  getOneSubcategory: async (req,res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category){
        const subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: req.params.subcategoryId})
        if (subcategory) {
          return res.status(200).json(subcategory)
        }
        throw new NotFoundError("No subcategory found.")
      }

      throw new NotFoundError("No category found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add subcategory
  // @route   POST /categories/:id/subcategories
  addSubcategory: async (req,res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category){
        const createdSubcategory = await SubcategoryObject.create(category.id, {...req.body})
        if (createdSubcategory) {
          return res.sendStatus(204)
        }
        throw new Error("Failed to create subcategory")
      }
      throw new NotFoundError("No category found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update subcategory
  // @route   POST /categories/:id/subcategories/:subcategoryId
  updateSubcategory: async (req,res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category) {
        const subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: req.params.subcategoryId})
        if (subcategory){
          const updatedSubcategory = await subcategory.update({...req.body})
          if (updatedSubcategory) {
            return res.sendStatus(204)
          }
          throw new Error("Failed to update category")
        }

        throw new NotFoundError("No subcategory found.")
      }

      throw new NotFoundError("No category found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update subcategory
  // @route   POST /categories/:id/subcategories/:subcategoryId
  removeSubcategory: async (req,res) => {
    try {
      const category = await CategoryObject.getOneCategoryBy({_id: req.params.id})
      if (category) {
        const subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: req.params.subcategoryId})
        if (subcategory) {
          const isRemoved = await subcategory.remove(category.id)
          if (isRemoved) {
            return res.sendStatus(204)
          }
          throw new Error("Failed to remove subcategory")
        }
        throw new NotFoundError("No subcategory found.")
      }

      throw new NotFoundError("No category found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  }
}
