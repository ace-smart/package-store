const axiosInstance = require("../../helper/axios.helper")
const { handleErrors, renderNotFoundPage, getMenu, makePagination } = require("../../helper/helper")
const getRelatedProducts = async (productId = null) => {
  try {
    const response = await axiosInstance.get(`/related-products?id=${productId}`)
    
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  showProductsByCategory: async (req, res) => {
    try {
      const categoryId = req.query.categoryId != null ? req.query.categoryId : null
      const response = await axiosInstance.get(`/products-by-category?categoryId=${categoryId}`)
      let products = []

      if (response.status === 200) {
        products = response.data
      }
      
      // === Pagination CONSTANT
      let currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1
      const itemPerPage = 12
      const numOfItems = (products != null) ? products.length : 0

      // Default pagination declaration
      let pagination = {
        numOfPages: 1,
        itemPerPage: itemPerPage,
        numOfItems: numOfItems,
        currentPage: currentPage
      }
      
      // Make pagination for contact items
      const helperPagination = makePagination(products, pagination.itemPerPage, pagination.currentPage)
      if (helperPagination != null) {
        pagination.numOfPages = helperPagination.numOfPages
        pagination.items = helperPagination.items
      }
      

      return res.render("templates/client/product/list", {
        layout: "client/index.layout.hbs",
        pageTitle: "Products",
        products: pagination.items,
        pagination: pagination,
        breadcrumb: [
          { link: "/", routeName: "Home" },
          { link: `/products-by-category?categoryId=${categoryId}`, routeName: "Products" },
        ],
        categories: await getMenu()
      })
    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },

  showProductsBySubcategory: async (req, res) => {
    try {
      const subcategoryId = req.query.subcategoryId != null ? req.query.subcategoryId : null
      const response = await axiosInstance.get(`/products-by-subcategory?subcategoryId=${subcategoryId}`)
      let products = []

      if(response.status === 200) {
        products = response.data
      }

      // === Pagination CONSTANT
      let currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1
      const itemPerPage = 12
      const numOfItems = (products != null) ? products.length : 0

      // Default pagination declaration
      let pagination = {
        numOfPages: 1,
        itemPerPage: itemPerPage,
        numOfItems: numOfItems,
        currentPage: currentPage
      }
      
      // Make pagination for contact items
      const helperPagination = makePagination(products, pagination.itemPerPage, pagination.currentPage)
      if (helperPagination != null) {
        pagination.numOfPages = helperPagination.numOfPages
        pagination.items = helperPagination.items
      }

      return res.render("templates/client/product/list", {
        layout: "client/index.layout.hbs",
        pageTitle: "Products",
        products: pagination.items,
        pagination: pagination,
        breadcrumb: [
          { link: "/", routeName: "Home" },
          { link: `/products-by-subcategory?subcategoryId=${subcategoryId}`, routeName: "Products" },
        ],
        categories: await getMenu()
      })
    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },

  showDetails: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/product/${req.query.id}`)

      if (response.status === 200 && response.data != null) {
        return res.render("templates/client/product/detail", {
          layout: "client/index.layout.hbs",
          pageTitle: "Product",
          product: response.data,
          relatedProducts: await getRelatedProducts(response.data.id),
          categories: await getMenu(),
          breadcrumb: [
            { link: "/", routeName: "Home" },
            { link: `/products-by-subcategory?subcategoryId=${response.data.subcategory.id}`, routeName: response.data.subcategory.name },
            { link: `/product?id=${response.data.id}`, routeName: response.data.name },
          ],
        })
      }
      
      // Throw Not found error
      return renderNotFoundPage(res, 'client')
    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },

  searchProductsByName: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/search-products?name=${req.query.productName}`)
      let products = []

      if (response.status === 200) {
        products = response.data
      }

      // === Pagination CONSTANT
      let currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1
      const itemPerPage = 12
      const numOfItems = (products != null) ? products.length : 0

      // Default pagination declaration
      let pagination = {
        numOfPages: 1,
        itemPerPage: itemPerPage,
        numOfItems: numOfItems,
        currentPage: currentPage
      }
      
      // Make pagination for contact items
      const helperPagination = makePagination(products, pagination.itemPerPage, pagination.currentPage)
      if (helperPagination != null) {
        pagination.numOfPages = helperPagination.numOfPages
        pagination.items = helperPagination.items
      }
      
      return res.render("templates/client/product/list", {
        layout: "client/index.layout.hbs",
        pageTitle: "Search",
        products: pagination.items,
        pagination: pagination,
        breadcrumb: [
          { link: "/", routeName: "Home" },
          { link: `/search-products?productName=${req.query.productName}`, routeName: `Searching \'${req.query.productName}\'` },
        ],
        categories: await getMenu()
      })

    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },
}
