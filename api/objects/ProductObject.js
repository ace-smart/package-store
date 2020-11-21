const ProductModel = require("../models/ProductModel")
const SubcategoryModel = require("../models/SubcategoryModel")
const SubcategoryObject = require('./SubcategoryObject')
const validator = require("validator")
const { isExistent, hasSpecialChars, STATUS_VALUES } = require("../helper/validation")
const ValidationError = require('../errors/validation')

class ProductObject {
  constructor({ _id, subcategoryId, name, details, price, status, createdAt }) {
    this.id = _id
    this.subcategoryId = subcategoryId
    this.name = name
    this.details = details
    this.price = price
    this.status = status
    this.createdAt = createdAt
  }

  async setSubcategory() {
    if (this.subcategoryId instanceof Object) {
      // populated
      this.subcategory = new SubcategoryObject({...this.subcategoryId})
      this.subcategoryId = this.subcategory.id.toString()
    } else if (typeof this.subcategoryId === 'string') {
      // existed
      this.subcategory = await SubcategoryObject.getOneSubcategoryBy({_id: this.subcategoryId})
    } else {
      this.subcategory = null
    }
  }

  // @desc:     Get product by criteria
  // @return:   ProductObject
  static async getOneProductBy(criteria = {}, selectFields = null) {
    try {
      const productDoc = await ProductModel.findOne(criteria, selectFields)
        .populate({path: 'subcategoryId'})
        .lean()
        
      if (productDoc) {
        const productObject = new ProductObject({...productDoc })
        await productObject.setSubcategory()
        return productObject
      }

      return null
    } catch (error) {
      throw error
    }
  }

  // @desc:     Get list of products by criteria
  // @return:   ProductObject[]
  static async getProductsBy(criteria = {}, selectFields = null) {
    try {
      const listOfProducts = await ProductModel.find(criteria, selectFields)
        .populate({path: 'subcategoryId'})
        .lean()
      
      if (listOfProducts.length > 0) {
        let productObjects = new Array()
        listOfProducts.forEach(async (element) => {
          const object = new ProductObject({ ...element})
          await object.setSubcategory()
          // object.clean()
          productObjects.push(object)
        })
        
        return productObjects
      }
      
      return null
    } catch (error) {
      throw error
    }
  }

  // @fields:   [subcategory, name, price, details, status]
  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    // === CREATE === ----------  Required fields
    if (type === "create") {
      if (this.subcategoryId == null || validator.isEmpty(this.subcategoryId.toString())) {
        errors.push({
          field: "subcategoryId",
          message: "Must be required.",
        })
      }
      if (this.name == null || validator.isEmpty(this.name.toString())) {
        errors.push({
          field: "name",
          message: "Must be required.",
        })
      }
      if (this.price == null || validator.isEmpty(this.price.toString())) {
        errors.push({
          field: "price",
          message: "Must be required.",
        })
      }

      // has errors
      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // subcategory
    if (this.subcategoryId != null) {
      if (!validator.isMongoId(this.subcategoryId.toString())) {
        errors.push({
          field: "subcategoryId",
          message: "Invalid format.",
          value: this.subcategoryId,
        })
      }
      if (!(await isExistent(SubcategoryModel, { _id: this.subcategoryId }))) {
        errors.push({
          field: "subcategoryId",
          message: "Not existent.",
          value: this.subcategoryId,
        })
      }
    }
    // name
    if (this.name != null && !validator.isEmpty(this.name.toString())) {
      if (hasSpecialChars(this.name.toString())){
        errors.push({
          field: "name",
          message: "Can not have special characters.",
          value: this.name,
        })
      }
      if (!validator.isLength(this.name.toString(), { min: 4, max: 200 })) {
        errors.push({
          field: "name",
          message: "Must be from 4 to 200 characters.",
          value: this.name,
        })
      }
      if (await isExistent(ProductModel, { name: this.name }, exceptionId)) {
        errors.push({
          field: "name",
          message: "Already existent.",
          value: this.name,
        })
      }
    }
    // price
    if (this.price != null && !validator.isEmpty(this.price.toString())) {
      if (!validator.isNumeric(this.price.toString())) {
        errors.push({
          field: "price",
          message: "Must be numbers",
          value: this.price,
        })
      }
      if (parseFloat(this.price.toString()) < 0) {
        errors.push({
          field: "price",
          message: "Can not be negative",
          value: this.price,
        })
      }
    }
    // details
    if (this.details != null && !JSON.stringify(this.details) !== "{}") {
      // details.size
      if (this.details.size != null && !validator.isEmpty(this.details.size.toString())) {
        if (!validator.isAlpha(this.details.size)) {
          errors.push({
            field: "details.size",
            message: "Only alphabetic characters are accepted.",
            value: this.details.size,
          })
        }
      }
      // details.color
      if (this.details.color != null ) {
        if (
          JSON.stringify(this.details.color) === "{}" ||
          this.details.color.colorName == null ||
          this.details.color.hexCode == null
        ) {
          errors.push({
            field: "color",
            message: "Must have two properties {colorName, hexCode}",
            value: this.details.color,
          })
        }
        if (!validator.isEmpty(this.details.color.colorName.toString())){
          if (hasSpecialChars(this.details.color.colorName)) {
            errors.push({
              field: "colorName",
              message: "Must be only numbers and characters",
              value: this.details.color.colorName,
            })
          }
        }
        
        if (!validator.isEmpty(this.details.color.hexCode.toString())){
          if (!validator.isHexColor(this.details.color.hexCode)) {
            errors.push({
              field: "hexCode",
              message: "Invalid value.",
              value: this.details.color.hexCode,
            })
          }
        }
      }
      // details.material
      if (this.details.material != null && !validator.isEmpty(this.details.material.toString())) {
        if (hasSpecialChars(this.details.material.toString())) {
            errors.push({
              field: "material",
              message: "Can not have special characters.",
              value: this.details.material,
            })
        }
      }
      // details.gender
      if (this.details.gender != null && !validator.isEmpty(this.details.gender.toString())) {
        if (!validator.isAlpha(this.details.gender)) {
          errors.push({
            field: "gender",
            message: "Only alphabetic characters are accepted.",
            value: this.details.gender,
          })
        }
      }
      // details.season
      if (this.details.season != null && !validator.isEmpty(this.details.season.toString())) {
        if (!validator.isAlpha(this.details.season)) {
          errors.push({
            field: "season",
            message: "Only alphabetic characters are accepted.",
            value: this.details.season,
          })
        }
      }
    }
    // status
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Value is not valid.",
          value: this.status,
        })
      }
    }

    if (errors.length > 0) {
      // has errors
      throw new ValidationError(errors)
    } else {
      return this
    }
  }

  // @desc:     Remove undefined props and lowercase fields.
  clean() {
    let productObject = this
    const fieldsToClean = ["name", "price", "details", "status"]
    for (const [key, value] of Object.entries(productObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === 'name') {
            productObject[key] = validator.trim(value)
          }
          if (key === 'status'){
            productObject[key] = validator.trim(value.toString().toLowerCase())
          }
          if (key === 'details') {
            if (productObject[key].color != null && productObject[key].color.colorName != null) {
              productObject[key].color.colorName = validator.trim(value.color.colorName.toString().toLowerCase())
            }
            if (productObject[key].size != null) {
              productObject[key].size = validator.trim(value.size.toUpperCase())
            }
            if (productObject[key].gender != null) {
              productObject[key].gender = validator.trim(value.gender.toString().toLowerCase())
            }
            if (productObject[key].season != null) {
              productObject[key].season = validator.trim(value.season.toString().toLowerCase())
            }
          }
          if (key === 'price') {
            productObject[key] = Math.abs(parseFloat(value.toString()))
          }
        }

        if (key === 'updatedAt') {
          productObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete productObject[key]
      }
    }

    return productObject
  }

  // @desc:   Empty => return true
  static hasEmptyDetails(productData) {
    const detailKeys = Object.keys(productData)
    let emptyProps = []
    for (const [key, value] of Object.entries(productData)) {
      if (value == null) {
        emptyProps.push(key)
      } else if (validator.isEmpty(value.toString())) {
        emptyProps.push(key)
      }
    }

    if (emptyProps.length === detailKeys.length) {
      return true
    }

    return false
  }

  // @desc:     Create a product
  // @fields:   [subcategory, name, price, details]
  // @return:   ProductObject
  static async create({ ...productData } = {}) {
    try {
      // [Update] Details
      if (productData.details) {
        if (!ProductObject.hasEmptyDetails(productData.details)) {
          delete productData.details
        }
      }
      
      // Add product
      let productObject = new ProductObject({...productData})
      const validation = await productObject.validate()
      if (validation) {
        productObject = productObject.clean()
        const createdProduct = await ProductModel.create(
          {...productObject })
        if (createdProduct) {
          return new ProductObject({...createdProduct._doc})
        }
      }

      throw new Error("Failed to create product.")
    } catch (error) {
      throw error
    }
  }

  // @desc:     Update product
  async update({...productData}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "ProductObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    if (!(await isExistent(ProductModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "ProductObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      // [Update] Details
      if (productData.details) {
        if (ProductObject.hasEmptyDetails(productData.details)) {
          delete productData.details
        }
      }

      let productObject = new ProductObject({ ...productData })
      const validation = await productObject.validate("update", this.id)
      if (validation) {
        productObject = productObject.clean()
        const updatedProduct = await ProductModel.findOneAndUpdate({ _id: this.id }, 
            {...productObject }, { new: true })
            
        return new ProductObject(updatedProduct)
      }
      throw new Error("Failed to update product.")
    } catch (error) {
      throw error
    }
  }

  // @return:   void
  async save() {
    const productToSave = this.clean()
    try {
      if (this.id != null) {
        const updatedProduct = new ProductObject(
          await ProductModel.findOneAndUpdate(
            { _id: productToSave.id },
            { ...productToSave },
            { new: true }
          ).lean()
        )

        return updatedProduct
      }

      throw new ObjectError({
        objectName: "ProductObject",
        errorProperty: "Id",
        message: "Can not save object with undefined or null id.",
      })
    } catch (error) {
      throw error
    }
  }

  // @return:   void
  async remove() {
    const productToRemove = this.clean()
    try {
      if (this.id != null) {
        const removedProduct = new ProductObject(
          await ProductModel.findOneAndDelete({ _id: productToRemove.id })
        )
        return removedProduct
      }

      throw new ObjectError({
        name: "ProductObject",
        errorProperty: "Id",
        message: "Can not delete object with undefined or null id.",
      })
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProductObject
