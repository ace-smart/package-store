const Category = require("../models/CategoryModel")
const categoryValidation = require("../validation/category.validation")

module.exports = {
    // @desc:   Show categories
    // @route   GET /categories
    showCategoryList: async (req, res) => {
        try {
            // const selectFields = "_id name status creat"
            // const categories = await User.find({}, selectFields).lean()
            const categories = await Category.find().lean()
            return res.status(200).json({success: true, categories: categories})
        } catch (error) {
            return res.status(500).json({success: false, message: error.message})
        }
    },

    // @desc:   Get categories by Id
    // @route   GET /categories/:id
    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id }).lean()
            if (category)
                return res.status(200).json({success: true,
                category :{
                    id: category._id,
                    name: category.name,
                    status: category.status,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                }})
            // Not found
            return res.status(404).json({ success: false, error: "No category found." })
        } catch (error) {
            return res.status(500).json({success: false, error: error.message})
        }
    },

    // @desc    Add new category
    // @route   POST /categories
    createNewCategory: async (req, res) => {
        try {
            const errors = await categoryValidation.create({...req.body})
            if (errors) return res.status(400).json({ success: false, errors: errors })

            // Valid input
            const newCategory = await Category.create({
                name: req.body.name,
                status: req.body.status || "deactivated"
            })

            if (newCategory)
                return res.status(201).json({success: true, category: {
                    id: newCategory._id,
                    name: newCategory.name,
                    status: newCategory.status.toLowerCase(),
                    createdAt: newCategory.createdAt
                }})

            return res.status(500).json({ success: false, error: "Failed to create." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, error: error.message})
        }
    },

    // @desc    Update user
    // @route   PUT /categories/:id
    updateCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id }).lean()

            if (category) {
                const errors = await categoryValidation.update({...req.body}, req.params.id)
                if (errors) return res.status(400).json({ success: false, errors: errors })

                // Check { password, role, status } are given
                const newName = (typeof req.body.name !== "undefined") 
                    ? req.body.name
                    : category.name
                const newStatus = (typeof req.body.status !== "undefined") 
                    ? req.body.status.toLowerCase()
                    : category.status

                const updated = await Category.findOneAndUpdate({_id: req.params.id},
                    {
                        name: newName,
                        status: newStatus,
                        updatedAt: Date.now()
                    }, {new: true})
                if (updated) return res.sendStatus(204)

                // Update failed
                return res.status(500).json({ success: false, error: "Failed to update." })
            }

            return res.status(404).json({ success: false, error: "No user found." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, message: error.message})
        }
    },

    // @desc    Delete user
    // @route   DELETE /categories/:id
    removeCategoryById: async (req, res) => {
        try {
            const category = await Category.findOneAndDelete({ _id: req.params.id })

            if (category) return res.sendStatus(204)

            return res.status(404).json({ success: false, error: "No category found." })
        } catch (error) {
            return res.status(500).json({success: false, message: error.message})
        }
    },

}
