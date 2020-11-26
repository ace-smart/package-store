const ProductObject = require("../objects/ProductObject")
const SubcategoryObject = require("../objects/SubcategoryObject")
const ErrorHandler = require("../helper/errorHandler")
const NotFoundError = require("../errors/not_found")
const CategoryObject = require("../objects/CategoryObject")

module.exports = {
    // @desc:   Show products
    // @route   GET /products
    showProductList: async (req, res) => {
        try {
            const productList = await ProductObject.getProductsBy()
            if (productList.length > 0) {
                return res.status(200).json(productList)
            }

            throw new NotFoundError("No product found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc:   Show products by category
    // @route   GET /products/by-category?categoryId='123123asd'
    showProductsByCategoryId: async (req, res) => {
        try {
            if (req.query.categoryId) {
                let category = await CategoryObject.getOneCategoryBy({ _id: req.query.categoryId })
                if (category) {
                    // Get Subcategories
                    let subcategoryList = new Array()
                    for (let i = 0; i < category.getSubcategories.length; i++) {
                        const subcategory = await SubcategoryObject.getOneSubcategoryBy({
                            _id: category.getSubcategories[i],
                        })
                        if (subcategory) {
                            subcategoryList.push(subcategory)
                        }
                    }
                    // Get products
                    if (subcategoryList.length > 0) {
                        let productList = new Array()
                        for (let j = 0; j < subcategoryList.length; j++) {
                            const products = await ProductObject.getProductsBy({
                                subcategoryId: subcategoryList[j].id,
                            })
                            if (products.length > 0) {
                                productList.push(products)
                            }
                        }

                        if (productList.length > 0) {
                            category.products = productList
                            return res.status(200).json(category)
                        }

                        throw new NotFoundError("No product found.")
                    }
                }
            }

            throw new NotFoundError("No category found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc:   Show products by subcategory
    // @route   GET /products/by-subcategory?subcategoryId='123123asd'
    showProductsBySubcategoryId: async (req, res) => {
        try {
            if (req.query.subcategoryId) {
                const subcategory = await SubcategoryObject.getOneSubcategoryBy({
                    _id: req.query.subcategoryId,
                })
                if (subcategory) {
                    const products = await ProductObject.getProductsBy({
                        subcategoryId: subcategory.id,
                    })
                    if (products.length > 0) {
                        return res.status(200).json(products)
                    }

                    throw new NotFoundError("No product found.")
                }
            }

            throw new NotFoundError("No subcategory found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc:   Get products by Id
    // @route   GET /products/:id
    getProductById: async (req, res) => {
        try {
            const product = await ProductObject.getOneProductBy({ _id: req.params.id })
            if (product) {
                return res.status(200).json(product)
            }
            throw new NotFoundError("No product found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Add new product
    // @route   POST /products
    createNewProduct: async (req, res) => {
        try {
            const createdProduct = await ProductObject.create({ ...req.body })
            if (createdProduct) {
                return res.status(201).json(createdProduct)
            }

            throw new Error("Failed to add new product")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Update product
    // @route   PUT /products/:id
    updateProductById: async (req, res) => {
        try {
            const product = await ProductObject.getOneProductBy({ _id: req.params.id })
            if (product) {
                const updatedProduct = await product.update({ ...req.body })
                if (updatedProduct) {
                    return res.sendStatus(204)
                }
                throw new Error("Failed to update product.")
            }

            throw new NotFoundError("No product found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },

    // @desc    Delete product
    // @route   DELETE /products/:id
    removeProductById: async (req, res) => {
        try {
            const product = await ProductObject.getOneProductBy({ _id: req.params.id })
            if (product) {
                const isRemoved = await product.remove()
                if (isRemoved) {
                    return res.sendStatus(204)
                }
                throw new Error("Failed to removed product.")
            }

            throw new NotFoundError("No product found.")
        } catch (error) {
            return ErrorHandler.sendErrors(res, error)
        }
    },
}
