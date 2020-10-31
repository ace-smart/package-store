const { default: validator } = require("validator")
const ValidationError = require("../errors/validation")
const CategoryModel = require("../models/CategoryModel")
const { isExistent, STATUS_VALUES } = require("../helper/validation")
const ObjectError = require("../errors/object")
const SubcategoryModel = require("../models/SubcategoryModel")

class CategoryObject {
  constructor({ _id, name, subcategories, status, createdAt }) {
    this.id = _id
    this.name = name
    this.subcategories = subcategories
    this.status = status
    this.createdAt = createdAt
  }

  set addOneSubcategory (subcategoryId) {
    if (subcategoryId == null) {
      throw new TypeError("Can not add subcategory with null or undefined value.")
    }else {
      this.subcategories.push(subcategoryId)
    }
  }

  set setSubcategories (subcategories) {
    if (subcategories instanceof Array) {
      this.subcategories = subcategories
    } else {
      throw new TypeError("subcategories must be an array.")
    }
  }

  get getSubcategories () {
    return this.subcategories
  }

  async removeSubcategory(subcategoryId = null) {
    if (subcategoryId = null){
      throw new TypeError("Can not remove with null or undefined subcategoryId.")
    }
    if (!(await isExistent(SubcategoryModel, {_id: subcategoryId}))){
      throw new ObjectError({
        objectName: 'SubcategoryObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const subcategoryList = this.subcategories.filter((value) => value != subcategoryId)
      this.subcategories = subcategoryList
      let isSaved = await this.save()
      if (isSaved) {
        return isSaved
      }

      throw new Error("Failed to remove subcategory.")
    } catch (error) {
      throw error
    }
  }

  static async getCategoriesBy(criteria = {}, selectFields = null) {
    try {
      const categoryList = await CategoryModel.find(criteria, selectFields).lean()
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

  static async getOneCategoryBy(criteria = {}, selectFields = null) {
    try {
      const category = await CategoryModel.findOne(criteria, selectFields).lean()
      if (category) {
        return new CategoryObject({ ...category })
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
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 40 })) {
        errors.push({
          field: "name",
          message: "Must be from 4 to 40 characters.",
        })
      }
      if (await isExistent(CategoryModel, { name: this.name }, exceptionId)) {
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
      console.log(error)
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
      const isSaved = await CategoryModel.findOneAndDelete({_id: this.id}).lean()
      if (isSaved) {
        return new CategoryObject({...isSaved})
      }

      throw new Error("Failed to remove category.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = CategoryObject
