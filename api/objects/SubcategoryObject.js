const SubcategoryModel = require("../models/SubcategoryModel")
const CategoryModel = require("../models/CategoryModel")
const NotFoundError = require("../errors/not_found")
const ValidationError = require("../errors/validation")
const ObjectError = require("../errors/object")
const CategoryObject = require("./CategoryObject")
const validator = require('validator')
const { STATUS_VALUES, isExistent } = require("../helper/validation")

class SubcategoryObject {
  constructor({ _id, name, status, createdAt }) {
    this.id = _id
    this.name = name
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneSubcategoryBy(criteria = {}, selectFields = null) {
    try {
      const subcategory = await SubcategoryModel.findOne(criteria, selectFields).lean()
      if (subcategory) {
        return new SubcategoryObject({ ...subcategory })
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

      if (await isExistent(SubcategoryModel, { name: this.name }, exceptionId)) {
        errors.push({
          field: "name",
          message: "Already existent in this category or other categories.",
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
    let subcategoryObject = this
    const fieldsToClean = ["name", "status"]
    for (const [key, value] of Object.entries(subcategoryObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === 'name') {
            subcategoryObject[key] = validator.trim(value.toString())
          }
          if (key === 'status') {
            subcategoryObject[key] = validator.trim(value.toString().toLowerCase())
          }
        }
        
        if (key === 'updatedAt') {
          subcategoryObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete subcategoryObject[key]
      }
    }

    return subcategoryObject
  }

  static async create(categoryId = null, { ...subcategoryData }) {
    if (categoryId == null) {
      throw new TypeError("Can not create with null or undefined categoryId")
    }

    if (!(await isExistent(CategoryModel, { _id: categoryId }))) {
      throw new ObjectError({
        objectName: "CategoryObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      let subcategoryObject = new SubcategoryObject({ ...subcategoryData })
      subcategoryObject = subcategoryObject.clean()
      const isValid = await subcategoryObject.validate("create")
      if (isValid) {
        const createdSubcategory = new SubcategoryObject(
          await SubcategoryModel.create({ ...isValid })
        )
        // add to Category
        const category = await CategoryObject.getOneCategoryBy({ _id: categoryId })
        if (category) {
          category.addOneSubcategory = createdSubcategory.id
          const isSaved = await category.save()
          if (isSaved) {
            return createdSubcategory
          }
        }
      }

      throw new Error("Failed to add subcategory")
    } catch (error) {
      throw error
    }
  }

  async update(data = {}) {
    if (this.id == null) {
      throw new TypeError("Can not create with null or undefined id")
    }

    if (!(await isExistent(SubcategoryModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "SubcategoryObject",
        errorProperty: "Id",
        message: "Id is not valid.",
      })
    }

    try {
      const subcategory = await SubcategoryModel.findOne({ _id: this.id }).lean()
      let updateData = await new SubcategoryObject({ ...data })
      updateData = updateData.clean()
      const isValid = await updateData.validate("update", subcategory._id)
      if (isValid) {
        let updatedSubcategory = await SubcategoryModel.findOneAndUpdate(
          { _id: subcategory._id },
          { ...isValid },
          { new: true }
        ).lean()
        updatedSubcategory = new SubcategoryObject({ ...updatedSubcategory })
        return updatedSubcategory
      }

      throw new Error("Failed to update subcategory.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null){
      throw new ObjectError({
        objectName: 'SubcategoryObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const subcategoryToSave = this.clean()
      let isSaved = await SubcategoryModel.findOneAndUpdate({_id: this.id}, {...subcategoryToSave}, {new: true}).lean()
      if (isSaved) {
        isSaved = new SubcategoryObject({...isSaved})
        return isSaved
      }

      throw new Error("Failed to save subcategory.")
    } catch (error) {
      throw error
    }
  }

  async remove(categoryId) {
    if (this.id == null){
      throw new ObjectError({
        objectName: 'SubcategoryObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    if (categoryId == null || !(await isExistent(CategoryModel,{_id: categoryId}))){
      throw new ObjectError({
        objectName: 'CategoryObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const category = await CategoryObject.getOneCategoryBy({_id: categoryId})
      if (category) {
        const removedSubcategory = await SubcategoryModel.findOneAndDelete({_id: this.id}).lean()
        if (removedSubcategory) {
          category.setSubcategories = category.getSubcategories.filter((value) => value != removedSubcategory._id.toString())
          const isSaved = await category.save()
          if (isSaved) {
            return new SubcategoryObject({...removedSubcategory})
          }
        }
        throw new Error("Failed to remove subcategory.")
      }

      throw new NotFoundError("No category found.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = SubcategoryObject
