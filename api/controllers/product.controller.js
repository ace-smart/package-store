const Product = require("../models/ProductModel")
const {validate_add_inp, validate_update_inp} = require("../validation/product")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show products
    // @route   GET /products
    showProductList: async (req, res) => {
        try {
            // const selectFields = "_id name status creat"
            // const categories = await User.find({}, selectFields).lean()
            const products = await Product.find().lean()
            return res.status(200).json({ success: true, products: products })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc:   Get products by Id
    // @route   GET /products/:id
    getProductById: async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id }).lean()
            if (product)
                return res.status(200).json({
                    success: true,
                    product: product,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No product found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new product
    // @route   POST /products
    createNewProduct: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newProduct = await Product.create(
                    sanitize.product({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    product: newProduct,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update product
    // @route   PUT /products/:id
    updateProductById: async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, product._id)
            if (isValidInp) {
                await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.product({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete product
    // @route   DELETE /products/:id
    removeProductById: async (req, res) => {
        try {
            const product = await Product.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
