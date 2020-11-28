const NotFoundError = require("../errors/not_found")
const GalleryModel = require("../models/GalleryModel")
const ProductModel = require("../models/ProductModel")
const validator = require("validator")
const { isExistent, hasSpecialChars, STATUS_VALUES } = require("../helper/validation")
const GALLERY_EXTENSION = ["jpg", "png", "jpeg"]
const GALLERY_MIMETYPE = ["image/jpeg", "image/png"]
const ValidationError = require("../errors/validation")

class GalleryObject {
  constructor({
    _id,
    productId,
    fileName,
    imageName,
    size,
    extension,
    mimeType,
    status,
    createdAt,
  }) {
    this.id = _id
    this.productId = productId
    this.fileName = fileName
    this.imageName = imageName
    this.size = size
    this.extension = extension
    this.mimeType = mimeType
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneImageBy(criteria = {}) {
    try {
      const image = await GalleryModel.findOne(criteria).populate({ path: "productId" }).lean()
      if (image) {
        return new GalleryObject({ ...image })
      }

      throw new NotFoundError("No image found.")
    } catch (error) {
      throw error
    }
  }

  static async getImagesBy(criteria = {}) {
    try {
      const images = await GalleryModel.find(criteria).populate({ path: "productId" }).lean()

      if (images && images.length > 0) {
        let gallery = []
        images.forEach((image) => {
          gallery.push(new GalleryObject({ ...image }))
        })

        return gallery
      }

			return null
			// throw new NotFoundError("No image found.")
    } catch (error) {
      throw error
    }
  }

  async validate(type = "create", exceptionId = null) {
    let errors = new Array()

    if (type === "create") {
      if (this.productId == null || validator.isEmpty(this.productId.toString())) {
        errors.push({
          field: "productId",
          message: "Must be required.",
        })
      }
      if (this.fileName == null || validator.isEmpty(this.fileName.toString())) {
        errors.push({
          field: "fileName",
          message: "Must be required.",
        })
      }
      if (this.extension == null || validator.isEmpty(this.extension.toString())) {
        errors.push({
          field: "extension",
          message: "Must be required.",
        })
      }
      if (this.mimeType == null || validator.isEmpty(this.mimeType.toString())) {
        errors.push({
          field: "mimeType",
          message: "Must be required.",
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }
    // update
    if (this.productId != null && !validator.isEmpty(this.productId.toString())) {
      if (!validator.isMongoId(this.productId.toString())) {
        errors.push({
          field: "productId",
          message: "Invalid format.",
          value: this.productId,
        })
      }
      if (!(await isExistent(ProductModel, { _id: this.productId }))) {
        errors.push({
          field: "productId",
          message: "Invalid value.",
          value: this.productId,
        })
      }
    }

    if (this.fileName != null && !validator.isEmpty(this.fileName.toString())) {
      if (!validator.isAlphanumeric(this.fileName.toString())) {
        errors.push({
          field: "fileName",
          message: "Only alphabetic characters and numbers are allowed.",
          value: this.fileName,
        })
      }

      if (await isExistent(GalleryModel, { fileName: this.fileName }, exceptionId)) {
        errors.push({
          field: "fileName",
          message: "Already existent.",
          value: this.fileName,
        })
      }
    }

    if (this.imageName != null && !validator.isEmpty(this.imageName.toString())) {
      if (!validator.isAlphanumeric(this.imageName.toString())) {
        errors.push({
          field: "fileName",
          message: "Only alphabetic characters and numbers are allowed.",
          value: this.imageName,
        })
      }

      if (await isExistent(GalleryModel, { imageName: this.imageName }, exceptionId)) {
        errors.push({
          field: "imageName",
          message: "Already existent.",
          value: this.imageName,
        })
      }
    }

    if (this.extension != null && !validator.isEmpty(this.extension.toString())) {
      if (!validator.isAlpha(this.extension.toString())) {
        errors.push({
          field: "extension",
          message: "Only alphabetic characters are accepted.",
          value: this.extension,
        })
      }
      if (!validator.isIn(this.extension.toString(), GALLERY_EXTENSION)) {
        errors.push({
          field: "extension",
          message: "Invalid value.",
          value: this.extension,
        })
      }
    }

    if (this.mimeType != null && !validator.isEmpty(this.mimeType.toString())) {
      if (!validator.isIn(this.mimeType.toString(), GALLERY_MIMETYPE)) {
        errors.push({
          field: "mimeType",
          message: "Invalid value.",
          value: this.mimeType,
        })
      }
    }

    if (this.status != null && !validator.isEmpty(this.status.toString())) {
      if (!validator.isIn(this.status.toLowerCase(), STATUS_VALUES)) {
        errors.push({
          field: "status",
          message: "Status is not valid.",
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
    let galleryObject = this

    const fieldsToClean = ["fileName", "imageName", "size", "extension", "status"]
    for (const [key, value] of Object.entries(galleryObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === "fileName" || key === "extension" || key === "mimeType" || key === "status") {
            galleryObject[key] = validator.trim(value.toString().toLowerCase())
          }
          if (key === "imageName") {
            if (value.toString() == "" || value == null) {
              galleryObject[key] = "Image#" + Math.floor(Math.random() * Math.floor(1000))
            } else {
              galleryObject[key] = validator.trim(value.toString().toLowerCase())
            }
          }
          if (key === "size") {
            galleryObject[key] = parseFloat(value.toString())
          }
        }

        if (key === "updatedAt") {
          galleryObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete galleryObject[key]
      }
    }

    return galleryObject
  }

  static async create({ ...galleryData }) {
    try {
      let galleryObject = new GalleryObject({ ...galleryData })
      const validation = await galleryObject.validate("create")
      if (validation) {
        galleryObject = galleryObject.clean()
        const isCreated = await GalleryModel.create({ ...validation })
        if (isCreated) {
          return new GalleryObject({ ...isCreated._doc })
        }
      }

      throw new Error("Failed to create gallery.")
    } catch (error) {
      throw error
    }
  }

  async update({ ...galleryData }) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "GalleryObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    if (!(await isExistent(GalleryModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: "GalleryObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      let updateObject = new GalleryObject({ ...galleryData })
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        updateObject = updateObject.clean()
        const updatedGallery = await GalleryModel.findOneAndUpdate(
          { _id: this.id },
          { ...updateObject },
          { new: true }
        )

        if (updatedGallery) {
          return new GalleryObject({ ...updatedGallery })
        }
      }

      throw new Error("Failed to update gallery.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: "GalleryObject",
        errorProperty: "Id",
        message: "Id is not valid",
      })
    }

    try {
      const isRemoved = await GalleryModel.findOneAndDelete({ _id: this.id }).lean()
      if (isRemoved) {
        return new GalleryObject({ ...isRemoved })
      }

      throw new Error("Failed to remove image.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = GalleryObject
