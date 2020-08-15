const Category = require("../models/CategoryModel")
const {validate_add_inp, validate_update_inp} = require("../validation/category")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show categories
    // @route   GET /categories
    showCategoryList: async (req, res) => {
        try {
            // const selectFields = "_id name status creat"
            // const categories = await User.find({}, selectFields).lean()
            const categories = await Category.find().lean()
            return res.status(200).json({ success: true, categories: categories })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    },

    // @desc:   Get categories by Id
    // @route   GET /categories/:id
    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id }).lean()
            if (category)
                return res.status(200).json({
                    success: true,
                    category: category,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No category found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new category
    // @route   POST /categories
    createNewCategory: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newCategory = await Category.create(
                    sanitize.profile({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    category: newCategory,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update categories
    // @route   PUT /categories/:id
    updateCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, category._id)
            if (isValidInp) {
                await Category.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.category({ ...req.body })
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete categories
    // @route   DELETE /categories/:id
    removeCategoryById: async (req, res) => {
        try {
            const category = await Category.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
