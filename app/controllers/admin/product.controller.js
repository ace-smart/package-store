const axiosInstance = require('../../helper/axios.helper')
const helper = require('../../helper/helper')
const getCategoryList = async function(accessToken) {
  try {
    const response = await axiosInstance.get('/admin/categories',
    {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
    
    if(response.status === 200) {
      return response.data
    }
  } catch (error) {
    return null    
  }
}
const getProductById = async function(accessToken, productId) {
  try {
    const response = await axiosInstance.get(`/admin/products/${productId}`, {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const getProductData = function(reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody))
  return {
    name: reqBody.name,
    subcategoryId: reqBody.subcategoryId,
    price: parseInt(reqBody.price),
    status: reqBody.status,
    details: {
      color: {
        colorName: reqBody.colorName,
        hexCode: reqBody.hexCode
      },
      size: reqBody.size,
      material: reqBody.material,
      gender: reqBody.gender,
      season: reqBody.season
    }
  }
}

module.exports = {
  // @desc:   Show products
  // @route   GET /products
  showProductList: async (req, res) => {
    try {
      const response = await axiosInstance.get("/admin/products", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })
      
      if (response.status === 200) {
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of products",
          route: "products",
          products: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   View products by Id
  // @route   GET /products/view/:id
  viewProductById: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/products/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          header: "Product information",
          route: "products",
          product: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    show create product form
  // @route   GET /products/add
  showCreateProductForm: async (req, res) => {
    return res.render("templates/admin/product/product.hbs", {
      layout: "admin/main.layout.hbs",
      content: "form",
      formType: 'create',
      header: "Create a new product",
      route: "products",
      categories: await getCategoryList(req.user.accessToken),
      user: await helper.getUserInstance(req),
      csrfToken: req.csrfToken(),
    })
  },

  // @desc    Create product
  // @route   POST /products/add
  createProduct: async (req, res) => {
    let productData = getProductData(req.body)
    try {
      const response = await axiosInstance.post(`/admin/products`,
      productData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 201) {
        req.flash("success", "You have created a new product.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: 'create',
          header: "Create a new product",
          route: "products",
          categories: await getCategoryList(req.user.accessToken),
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, productData)
        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: 'create',
          header: "Create a new product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await helper.getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
        })
      }

      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Show update form
  // @route   GET /products/edit/:id
  showUpdateForm: async (req, res) => {
    try {
      const product = await getProductById(req.user.accessToken, req.params.id)
      if (product) {
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: 'update',
          header: "Update product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await helper.getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          product: product,
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Update product
  // @route   PUT /products/edit/:id
  updateProductById: async (req, res) => {
    let productData = {}
    try {
      product = await getProductById(req.user.accessToken, req.params.id)
      if (product) {
        // console.log(product)
        productData = helper.getFilledFields(getProductData(req.body), product)
        console.log(productData)
      }

      const response = await axiosInstance.put(`/admin/products/${req.params.id}`, productData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204){
        req.flash("success", "Your changes were successfully saved.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: 'update',
          header: "Update product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await helper.getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          product: await getProductById(req.user.accessToken, req.params.id),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)

        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: 'update',
          header: "Update product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await helper.getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          product: productData,
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
        })
      }
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Deactivate product
  // @route   PUT /products/deactivate/:id
  deactivateProductById: async (req, res) => {
    try {
      const response = await axiosInstance.put(`/admin/products/${req.params.id}`,
      {
        status: "deactivated"
      },
      {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Activate product
  // @route   PUT /products/activate/:id
  activateProductById: async (req, res) => {
    try {
      const response = await axiosInstance.put(`/admin/products/${req.params.id}`,
      {
        status: "activated"
      },
      {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Delete product
  // @route   DELETE /products/:id
  removeProductById: async (req, res) => {
    try {
      const response = await axiosInstance.delete(`/admin/products/${req.params.id}`,
      {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },
}
