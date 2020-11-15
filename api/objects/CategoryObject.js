const validator = require("validator")
const ValidationError = require("../errors/validation")
const CategoryModel = require("../models/CategoryModel")
const { isExistent, STATUS_VALUES } = require("../helper/validation")
const ObjectError = require("../errors/object")
const SubcategoryObject = require("./SubcategoryObject")
const mongoose = require('mongoose')
const castToObjectId = mongoose.Types.ObjectId

class CategoryObject {
  constructor({ _id, name, subcategories, status, createdAt }) {
    this.id = _id
    this.name = name
    this.status = status
    this.createdAt = createdAt
    if (subcategories){
      this.subcategories = this.parseSubcategories(subcategories)
    }
  }


  parseSubcategories (subcategories) {
    if (subcategories instanceof Array) {
      if (subcategories.length > 0) {
        const listOfSubcates = subcategories.map(element => new SubcategoryObject({...element})) 
        
        return listOfSubcates
      }

      return []
    } else {
      throw new TypeError("subcategories must be an array.")
    }
  }

  static async getCategoriesBy(criteria = {}) {
    if (criteria._id) {
      criteria._id = castToObjectId(criteria._id)
    }

    try {
      const categoryList = await CategoryModel.aggregate([
        {$match: criteria},
        {$lookup: 
          {
            from: 'subcategories',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'subcategories'
          } 
        }
      ])

      if (categoryList.length > 0) {
        let categoryObjects = new Array()
        categoryList.forEach((element) => {
          const object = new CategoryObject({ ...element })
          categoryObjects.push(object)
        })

        return categoryObjects
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getOneCategoryBy(criteria = {}) {
    if (criteria._id) {
      criteria._id = castToObjectId(criteria._id)
    }

    try {
      let category = (await CategoryModel.aggregate([
          {$match: criteria},
          {$lookup: 
            {
              from: 'subcategories',
              localField: '_id',
              foreignField: 'categoryId',
              as: 'subcategories'
            } 
          }
        ]).limit(1))[0]
      
        
      if (category) {
        return new CategoryObject({...category})
      }

      return null
    } catch (error) {
      throw error
    }
  }

  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    if (type === "create") {
      if (typeof this.name === "undefined" || validator.isEmpty(this.name)) {
        errors.push({
          field: "name",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    if (this.name != null && !validator.isEmpty(this.name)) {
      if (!validator.isAlphanumeric(this.name)) {
        errors.push({
          field: "name",
          message: "Must contain only numbers and characters.",
          value: this.name
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 40 })) {
        errors.push({
          field: "name",
          message: "Must be from 4 to 40 characters.",
          value: this.name
        })
      }
      if (await isExistent(CategoryModel, { name: this.name }, exceptionId)) {
        errors.push({
          field: "name",
          message: "Already existent.",
          value: this.name
        })
      }
    }

    if (this.status != null && !validator.isEmpty(this.status)) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Not valid.",
          value: this.status.toLowerCase()
        })
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    } else {
      return this
    }
  }

  clean() {
    let categoryObject = this
    const fieldsToClean = ["name", "status"]
    for (const [key, value] of Object.entries(categoryObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === 'name') {
            categoryObject[key] = validator.trim(value.toString())
          }
          if (key === 'status') {
            categoryObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }

        if (key === 'updatedAt') {
          categoryObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete categoryObject[key]
      }
    }

    return categoryObject
  }

  static async create(categoryData = {}) {
    try {
      let categoryObject = new CategoryObject({ ...categoryData })
      categoryObject = categoryObject.clean()
      const validation = await categoryObject.validate("create")
      if (validation) {
        const isCreated = new CategoryObject(await CategoryModel.create({ ...validation }))
        if (isCreated) {
          return isCreated
        }
      }

      throw new Error("Failed to create category.")
    } catch (error) {
      throw error
    }
  }

  async update(info = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "CategoryObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    if (!(await isExistent(CategoryModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "CategoryObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      let updateObject = new CategoryObject({ ...info })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        const updatedCategory = new CategoryObject(
          await CategoryModel.findOneAndUpdate({ _id: this.id }, { ...validation }, { new: true })
        )
        return updatedCategory
      }

      throw new Error("Failed to update.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'CategoryObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const categoryToSave = this.clean()
      let isSaved = await CategoryModel.findOneAndUpdate({_id: categoryToSave.id}, {...categoryToSave}, {new: true}).lean()
      if (isSaved) {
        isSaved = new CategoryObject({...isSaved})
        return isSaved
      }

      throw new Error("Failed to save category.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'CategoryObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const isRemoved = await CategoryModel.findOneAndDelete({_id: this.id}).lean()
      if (isRemoved) {
        return new CategoryObject({...isRemoved})
      }

      throw new Error("Failed to remove category.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = CategoryObject
