const ProductModel = require("../models/ProductModel")
const SubcategoryModel = require("../models/SubcategoryModel")
const CategoryModel = require("../models/CategoryModel")
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

  // @desc:     Get product by criteria
  // @return:   ProductObject
  static async getOneProductBy(criteria = {}, selectFields = null) {
    try {
      const product = await ProductModel.findOne(criteria, selectFields).lean()
      if (product) {
        const productObject = new ProductObject({ ...product })
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
      const listOfProducts = await ProductModel.find(criteria, selectFields).lean()
      if (listOfProducts.length > 0) {
        let productObjects = new Array()
        listOfProducts.forEach((element) => {
          const object = new ProductObject({ ...element })
          object.clean()
          productObjects.push(object)
        })

        return productObjects
      }

      return null
    } catch (error) {
      throw error
    }
  }

  // @fields:   [subcategoryId, name, price, details, status]
  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    // === CREATE === ----------  Required fields
    if (type === "create") {
      if (typeof this.subcategoryId === "undefined" || validator.isEmpty(this.subcategoryId)) {
        errors.push({
          field: "subcategoryId",
          message: "Must be required.",
        })
      }
      if (typeof this.name === "undefined" || validator.isEmpty(this.name)) {
        errors.push({
          field: "name",
          message: "Must be required.",
        })
      }
      if (typeof this.price === "undefined") {
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

    // subcategoryId
    if (typeof this.subcategoryId !== "undefined" && !validator.isEmpty(this.subcategoryId)) {
      if (!validator.isMongoId(this.subcategoryId)) {
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
    if (typeof this.name !== "undefined" && !validator.isEmpty(this.name)) {
      if (
        validator.matches(
          this.name,
          new RegExp(
            "[\r\n\t\f\v\\`~\\!@#\\$%\\^&\\*()_\\+\\=\\[\\]\\{\\};'\"<>\\?\\-\\/\\.\\,:]+",
            "g"
          )
        )
      ) {
        errors.push({
          field: "name",
          message: "Must contain only numbers,characters and spaces.",
          value: this.name,
        })
      }
      if (!validator.matches(validator.trim(this.name), RegExp("\\w+|(\\w+\\s)", "g"))) {
        errors.push({
          field: "name",
          message: "Must contain only numbers and characters.",
          value: this.name,
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 200 })) {
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
    if (typeof this.price !== "undefined") {
      if (
        JSON.stringify(this.price) === "{}" ||
        typeof this.price === "string" ||
        this.price.value == null ||
        this.price.currency == null
      ) {
        errors.push({
          field: "price",
          message: "Must contain two properties {value, currency}",
          value: this.price,
        })
      }
      if (!validator.isNumeric(this.price.value.toString())) {
        errors.push({
          field: "price.value",
          message: "Must be numbers",
          value: this.price,
        })
      }
      if (!validator.isAlpha(this.price.currency)) {
        errors.push({
          field: "price.currency",
          message: "Must contain only alphabetic characters. (eg. USD, AUS, CAD)",
          value: this.price,
        })
      }
      if (!validator.isLength(this.price.currency, { max: 6 })) {
        errors.push({
          field: "price.currency",
          message: "Must be under 6 characters.",
          value: this.price,
        })
      }
    }
    // details
    if (typeof this.details !== "undefined" && !JSON.stringify(this.details) !== "{}") {
      // details.size
      if (this.details.size != null) {
        if (!validator.isAlphanumeric(this.details.size)) {
          errors.push({
            field: "details.size",
            message: "Must be only numbers and characters",
            value: this.details,
          })
        }
      }
      // details.color
      if (this.details.color != null) {
        if (
          JSON.stringify(this.details.color) === "{}" ||
          this.details.color.name == null ||
          this.details.color.hexCode == null
        ) {
          errors.push({
            field: "details.color",
            message: "Must have two properties {name, hexCode}",
            value: this.details,
          })
        }
        if (!validator.isAlphanumeric(this.details.color.name)) {
          errors.push({
            field: "details.color.name",
            message: "Must be only numbers and characters",
            value: this.details,
          })
        }
        if (!validator.isHexColor(this.details.color.hexCode)) {
          errors.push({
            field: "details.color.hexCode",
            message: "Invalid value.",
            value: this.details,
          })
        }
      }
      // details.tags
      if (this.details.tags != null) {
        if (!Array.isArray(this.details.tags)) {
          errors.push({
            field: "details.tags",
            message: "Must be an array of strings",
            value: this.details,
          })
        }
        if (this.details.tags.length > 0) {
          const invalidElements = this.details.tags.find((ele) => !validator.isAlphanumeric(ele))
          if (invalidElements) {
            errors.push({
              field: "details.tags",
              message: "Must only have elements which are numbers and characters",
              value: this.details,
            })
          }
        }
      }
      // details.description
      if (this.details.description != null) {
        if (hasSpecialChars(this.description)) {
          errors.push({
            field: "details.description",
            message: "Can not be filled in with special characters",
            value: this.details,
          })
        }
        if (!validator.isLength(this.description, { max: 300 })) {
          errors.push({
            field: "details.description",
            message: "Must be under 300 characters.",
            value: this.details,
          })
        }
      }
      // details.madeIn
      if (this.details.madeIn != null) {
        if (!validator.isAlphanumeric(this.details.madeIn)) {
          errors.push({
            field: "details.madeIn",
            message: "Must be only numbers and characters",
            value: this.details,
          })
        }
      }
      // details.weight
      if (this.details.weight != null) {
        if (
          JSON.stringify(this.details.weight) === "{}" ||
          this.details.weight.value == null ||
          this.details.weight.unit == null
        ) {
          errors.push({
            field: "details.weight",
            message: "Must contain two properties {value, unit}",
            value: this.details,
          })
        }
        if (!validator.isNumeric(this.details.weight.value.toString())) {
          errors.push({
            field: "details.weight.value",
            message: "Must be only numbers",
            value: this.details,
          })
        }
        if (!validator.isAlpha(this.details.weight.unit)) {
          errors.push({
            field: "details.weight.unit",
            message: "Must be only alphabetic characters (eg. Kg, g, lbs)",
            value: this.details,
          })
        }
      }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status)) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "The value of the field 'status' is not valid.",
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
            if (productObject[key].color != null && productObject[key].color.name != null) {
              productObject[key].color.name = validator.trim(value.color.name.toString().toLowerCase())
            }
            if (productObject[key].tags.length > 0) {
              for (let x = 0; x < productObject[key].tags.length; x++){
                productObject[key].tags[x] = validator.trim(value.tags[x].toString().toLowerCase())
              }
            }
            if (productObject[key].weight != null) {
              if (productObject[key].weight.value != null) {
                productObject[key].weight.value = parseFloat(value.weight.value.toString())
              }
              if (productObject[key].weight.unit != null) {
                productObject[key].weight.unit = validator.trim(value.weight.unit.toUpperCase())
              }
            }
          }
          if (key === 'price') {
            productObject[key].value = parseFloat(value.value.toString())
            productObject[key].currency = validator.trim(value.currency.toUpperCase())
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

  // @desc:     Create a product
  // @fields:   [subcategoryId, name, price, details]
  // @return:   ProductObject
  static async create({ ...productData } = {}) {
    try {
      let productObject = new ProductObject({...productData})
      productObject = productObject.clean()
      const isValid = await productObject.validate()
      if (isValid) {
        const createdProduct = new ProductObject(await ProductModel.create({...isValid}))
        if (createdProduct) {
          return createdProduct
        }
      }

      throw new Error("Failed to create product.")
    } catch (error) {
      throw error
    }
  }

  // @desc:     Update product
  async update(info = {}) {
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
      let productObject = new ProductObject({ ...info })
      productObject = productObject.clean()
      // console.log(productObject)
      const validation = await productObject.validate("update", this.id)
      if (validation) {
        const updatedProduct = new ProductObject(
          await ProductModel.findOneAndUpdate({ _id: this.id }, { ...productObject }, { new: true })
        )
        return updatedProduct
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
