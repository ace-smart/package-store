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
      return res.status(200).json(productList)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show products
  // @route   GET /related-products?id='1234'
  showRelatedProducts: async (req, res) => {
    try {
      const relatedProducts = await ProductObject.getRelatedProducts(req.query.id)
      return res.status(200).json(relatedProducts)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show all activated products
  // @route   GET /all-products
  showAllProducts: async (req, res) => {
    try {
      const allProducts = await ProductObject.getAllProducts()
      return res.status(200).json(allProducts)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get best sellers
  // @route   GET /get-best-sellers
  getBestSellers: async (req, res) => {
    try {
      const bestSellers = await ProductObject.getBestSellers()
      return res.status(200).json(bestSellers)
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

          return res.status(200).json(products)
        }
      }
      
      throw new NotFoundError("No subcategory found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show products by category
  // @route   GET /products-by-category?categoryId='1234'
  showProductsByCategoryId: async (req, res) => {
    try {
      if (req.query.categoryId) {
        const category = await CategoryObject.getOneCategoryBy({
          _id: req.query.categoryId,
        })
        if (category) {
          const products = await ProductObject.getProductsByCategory(category.id)

          return res.status(200).json(products)
        }
      }

      throw new NotFoundError("No category found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Search products by name
  // @route   GET /search-products?name='1234'
  searchProductsByName: async (req, res) => {
    try {
      const productName = req.query.name
      if (productName) {
        const result = await ProductObject.getProductsBy({name: { $regex: new RegExp(`${productName}`) , $options: 'i' }})
        
        return res.status(200).json(result)
      }

      return res.status(200).json(null)
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
      
      return res.status(200).json(product)
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
