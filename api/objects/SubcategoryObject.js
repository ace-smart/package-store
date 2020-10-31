const SubcategoryModel = require("../models/SubcategoryModel")
const CategoryModel = require("../models/CategoryModel")
const NotFoundError = require("../errors/not_found")
const ValidationError = require("../errors/validation")
const ObjectError = require("../errors/object")
const CategoryObject = require("./CategoryObject")
const validator = require('validator')
const { STATUS_VALUES, isExistent } = require("../helper/validation")

class SubcategoryObject {
  constructor({ _id, name, status }) {
    this.id = _id
    this.name = name
    this.status = status
  }

  // static async getSubcategoriesBy(criteria = {}, selectFields = null) {
  //   try {
  //     const subcategories = await SubcategoryModel.find(criteria, selectFields).lean()
  //     if (subcategories.length > 0) {
  //       const subcategoryList = subcategories.map((value) => new SubcategoryObject({ ...value }))
  //       // for (let i = 0;i < subcategories.length ; i++){

  //       // }
  //       return subcategoryList
  //     }

  //     throw new NotFoundError("No subcategory found.")
  //   } catch (error) {
  //     throw error
  //   }
  // }

  static async getOneSubcategoryBy(criteria = {}, selectFields = null) {
    try {
      const subcategory = await SubcategoryModel.findOne(criteria, selectFields).lean()
      // if (subcategory) {
        return new SubcategoryObject({ ...subcategory })
      // }

      // throw new NotFoundError("No subcategory found.")
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
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 40 })) {
        errors.push({
          field: "name",
          message: "Must be from 4 to 40 characters.",
        })
      }
      if (await isExistent(SubcategoryModel, { name: this.name }, exceptionId)) {
        errors.push({
          field: "name",
          message: "Already existent.",
        })
      }
    }

    if (this.status != null && !validator.isEmpty(this.status)) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Not valid.",
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
    const lowerCaseFields = ["status"]
    for (const [key, value] of Object.entries(subcategoryObject)) {
      if (value != null) {
        const isFound = lowerCaseFields.find((field) => key === field)
        if (isFound) {
          subcategoryObject[key] = value.toString().toLowerCase()
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
