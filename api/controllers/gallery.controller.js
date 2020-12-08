const GalleryObject = require("../objects/GalleryObject")
const ErrorHandler = require("../helper/errorHandler")
const NotFoundError = require("../errors/not_found")

module.exports = {
    // @desc    Show gallery
    // @route   GET /gallery?productId='123'
    showProductGallery: async (req, res) => {
        try {
            let gallery = []
            if (req.query.productId) {
                gallery = await GalleryObject.getImagesBy({ productId: req.query.productId })
            } else {
                gallery = await GalleryObject.getImagesBy()
            }

            if (gallery) {
                return res.status(200).json(gallery)
            }

            return res.status(200).json(null)
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Get gallery by id
    // @route   GET /gallery/:id
    getProductImg: async (req, res) => {
        try {
            const gallery = await GalleryObject.getOneImageBy({ _id: req.params.id })
            if (gallery) {
                return res.status(200).json(gallery)
            }
            
            return res.status(200).json(null)
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Add new image
    // @route   POST /gallery
    createNewImage: async (req, res) => {
        try {
            const createdImage = await GalleryObject.create({ ...req.body })
            if (createdImage) {
                return res.status(201).json(createdImage)
            }

            throw new Error("Failed to add new image")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Update image
    // @route   PUT /gallery/:id
    updateProductImage: async (req, res) => {
        try {
            const image = await GalleryObject.getOneImageBy({ _id: req.params.id })
            if (image) {
                const isUpdated = await image.update({ ...req.body })
                if (isUpdated) {
                    return res.sendStatus(204)
                }
                throw new Error("Failed to update the image")
            }

            throw new NotFoundError("No image found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Remove image
    // @route   DELETE /gallery/:id
    removeProductImage: async (req, res) => {
        try {
            const image = await GalleryObject.getOneImageBy({ _id: req.params.id })
            if (image) {
                const isRemoved = await image.remove({ ...req.body })
                if (isRemoved) {
                    return res.sendStatus(204)
                }
                throw new Error("Failed to remove the image")
            }
            
            throw new NotFoundError("No image found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },
}
